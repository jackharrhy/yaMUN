import bcrypt from "bcrypt";
import express from "express";
import { Types } from "mongoose";

import User from "../models/user";
import { Forbidden } from "./errors";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const checkPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const freshUserIdOrUndefined = async (
  req: express.Request
): Promise<Types.ObjectId | undefined> => {
  if (req.session.userId === undefined) {
    return undefined;
  } else {
    if (await User.exists({ _id: req.session.userId })) {
      return Types.ObjectId(req.session.userId);
    } else {
      throw new Forbidden("authenticated user no longer exists");
    }
  }
};

export const expectUserId = async (
  req: express.Request
): Promise<Types.ObjectId> => {
  const userId = await freshUserIdOrUndefined(req);
  if (userId === undefined) {
    throw new Forbidden("requires authentication");
  } else {
    return userId;
  }
};
