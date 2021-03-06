import { JSONSchemaType } from "ajv";
import debugFactory from "debug";
import express from "express";

import User, { IUserDocument } from "../../models/user";
import { handleRequestBody } from "../../utils/ajv";
import { expectUserId } from "../auth";
import { Forbidden } from "../errors";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

const debug = debugFactory("backend/api/controllers/users");

interface ICreateUserInput {
  username: IUserDocument["username"];
  password: string;
}

interface ILoginUserInput extends ICreateUserInput {}

const createUserInputSchema: JSONSchemaType<ICreateUserInput> = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  required: ["username", "password"],
  additionalProperties: false,
};

const loginUserInputSchema: JSONSchemaType<ILoginUserInput> = createUserInputSchema;

const usersController = {
  async create(req: express.Request, res: express.Response) {
    const createUserInput = handleRequestBody(createUserInputSchema, req.body);

    const user = await User.createUser(
      createUserInput.username,
      createUserInput.password
    );

    req.session.userId = user.id;
    res.sendStatus(204);
  },

  async login(req: express.Request, res: express.Response) {
    const loginInput = handleRequestBody(loginUserInputSchema, req.body);

    const userId = await User.login(loginInput.username, loginInput.password);

    if (userId == null) {
      throw new Forbidden("incorrect password");
    } else {
      req.session.userId = userId;
      res.sendStatus(204);
    }
  },

  async logout(req: express.Request, res: express.Response) {
    req.session.destroy(() => {
      res.sendStatus(204);
    });
  },

  async getInfoAboutSelf(req: express.Request, res: express.Response) {
    const userId = await expectUserId(req);
    const user: IUserDocument = User.findById(userId);
    res.json({
      username: user.username,
    });
  },
};

export default usersController;
