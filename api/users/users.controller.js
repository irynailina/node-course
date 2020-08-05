const Joi = require("@hapi/joi");
const { MongoClient, ObjectID } = require("mongodb");
const contactModel = require("../contacts/contacts.model");
const userModel = require("./users.model");
const {
  Types: { ObjectId },
} = require("mongoose");
const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../helpers/errors.constructors");
const _ = require("lodash");
const multer = require("multer");
const uuid = require("uuid");
const { emailingClient } = require("./email.client");

const dbName = "db-contacts";

let db;

async function main() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URL);
    console.log("Database connection successful");
    db = client.db(dbName);
    contactsCollection = db.collection("users");
  } catch (error) {
    console.log("Database start failed", error);
    process.exit(1);
  }
}

main();

class UserController {
  constructor() {
    this._costFactor = 4;
  }

  get createUser() {
    return this._createUser.bind(this);
  }

  get getUsers() {
    return this._getUsers.bind(this);
  }

  get getUseById() {
    return this._getUserById.bind(this);
  }

  get getCurrentUser() {
    return this._getCurrentUser.bind(this);
  }

  async _getUsers(req, res, next) {
    try {
      const users = await userModel.find();
      return res.status(200).json(this.prepareUsersResponse(users));
    } catch (err) {
      next(err);
    }
  }

  async _getUserById(req, res, next) {
    try {
      const id = req.params.id;
      const user = await contactModel.findById(id);
      if (!user) {
        return res.status(404).send("Contact not found");
      }

      const [userForResponse] = this.prepareUsersResponse([user]);
      return res.status(200).send(userForResponse);
    } catch (err) {
      next(err);
    }
  }

  async _createUser(req, res, next) {
    const { password, name, email } = req.body;
    const passwordHash = await bcryptjs.hash(password, this._costFactor);
    const user = await userModel.findUserByEmail(email);
    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }

    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      verificationToken: uuid.v4(),
    });

    await this.sendVerificationEmail(newUser);

    return res.status(201).json({
      email: email,
      subscription: "free",
    });
  }

  validateCreateUser(req, res, next) {
    const createUserRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
      avatarURL: Joi.string(),
    });

    const result = createUserRules.validate(req.body);
    if (result.error) {
      return res
        .status(400)
        .send("Ошибка от Joi или другой валидационной библиотеки");
    }
    next();
  }

  validateId(req, res, next) {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Not found");
    }
    next();
  }

  validateLogin(req, res, next) {
    const loginRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = loginRules.validate(req.body);
    if (result.error) {
      return res
        .status(400)
        .send("Ошибка от Joi или другой валидационной библиотеки");
    }
  }

  async login(req, res, next) {
    try {
      const { email, password, subscription } = req.body;
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(401).send("Email or password is wrong");
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send("Email or password is wrong");
      }

      if (user.verificationToken) {
        return res.status(401).send("User is not verified");
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 24 * 60 * 60,
      });
      console.log(token);
      await userModel.updateToken(user._id, token);
      return res.status(200).json({
        token: token,
        user: {
          email: user.email,
          subscription: "free",
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization") || "";
      const token = authorizationHeader.replace("Bearer ", "");
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("User not authorized"));
      }
      const user = await userModel.findById(userId);

      if (!user || user.token !== token) {
        throw new UnauthorizedError();
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;
      await userModel.updateToken(user._id, null);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  prepareUsersResponse(users) {
    return users.map((user) => {
      const { email, password, subscription, token, _id } = user;
      return { id: _id, email, subscription };
    });
  }

  async _getCurrentUser(res, req, next) {
    const [userForResponse] = this.prepareUsersResponse([req.user]);
    return res.status(200).json({ email: email, subscription: "free" });
  }

  async sendVerificationEmail(user) {
    const { email, verificationToken } = user;
    const verificationLink = `${process.env.SERVER_BASE_URL}/auth/verify/${verificationToken}`;
    await emailingClient.sendVerificationEmail(email, verificationLink);
  }

  async verifyUser(req, res, next) {
    const { verificationToken } = req.params;
    const user = await userModel.findOneAndUpdate(
      {
        verificationToken,
      },
      { verificationToken: null }
    );

    if (!user) {
      return res.status(404).send("User nod found");
    }

    return res.status(200).send("OK");
  }
}

module.exports = new UserController();
