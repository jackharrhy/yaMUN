import Ajv, { JSONSchemaType } from "ajv";
import debugFactory from "debug";
import express from "express";
import User, { IUser } from "../../models/user";
import { handleRequestBody } from "../../utils/ajv";
import { BadRequest } from "../errors";

const debug = debugFactory("backend/api/controllers/users");
const ajv = new Ajv();

interface ICreateUserInput {
  username: IUser["username"];
  password: IUser["password"];
  email: IUser["email"];
}

const createUserInputSchema: JSONSchemaType<ICreateUserInput> = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
    email: { type: "string" },
  },
  required: ["username", "password", "email"],
  additionalProperties: false,
};

const usersController = {
  async create(req: express.Request, res: express.Response) {
    const createUserInput = handleRequestBody(createUserInputSchema, req.body);
    const user = await User.create(createUserInput);
    debug("user", user);
    res.json(user);
  },
};

export default usersController;
