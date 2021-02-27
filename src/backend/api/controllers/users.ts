import Ajv, { JSONSchemaType } from "ajv";
import debugFactory from "debug";
import express from "express";
import User, { IUser } from "../../models/user";

const debug = debugFactory("backend/api/controllers/users");
const ajv = new Ajv();

interface ICreateUserInput {
  username: IUser["username"];
  password: IUser["password"];
  email: IUser["email"];
}

const UserValidator: JSONSchemaType<ICreateUserInput> = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
    email: { type: "string" },
  },
  required: ["username", "password", "email"],
  additionalProperties: false,
};

const validate = ajv.compile(UserValidator);

const usersController = {
  async create(req: express.Request, res: express.Response) {
    if (validate(req.body)) {
      const user = await User.create(req.body);
      debug("user", user);
      res.json(user);
    } else {
      res.sendStatus(400);
    }
  },
};

export default usersController;
