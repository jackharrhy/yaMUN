import { JSONSchemaType } from "ajv";
import debugFactory from "debug";
import express from "express";
import User, { IUserDocument } from "../../models/user";
import { handleRequestBody } from "../../utils/ajv";

const debug = debugFactory("backend/api/controllers/users");

interface ICreateUserInput {
  username: IUserDocument["username"];
  password: IUserDocument["password"];
  email: IUserDocument["email"];
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
    // TODO properly store password with hasing and salting and all that good stuff
    const user = await User.create(createUserInput);
    debug("user", user);
    res.json(user);
  },
};

export default usersController;
