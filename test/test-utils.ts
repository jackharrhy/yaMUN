import { MongoError } from "mongodb";

import { database } from "../src/backend/database";

export const dropCollection = async (collectionName: string) => {
  try {
    await database.collection(collectionName).drop();
  } catch (err) {
    // 26 is namespace not found, aka a collection that does not exist
    if (err instanceof MongoError && err.code == 26) {
      return;
    } else {
      throw err;
    }
  }
};
