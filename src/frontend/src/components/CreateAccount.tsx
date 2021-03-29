import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { useStoreActions } from "../store";
import Box from "./Box";

type CreateAccountFormInputs = {
  username: string;
  password: string;
};

function CreateAccount() {
  const createAccount = useStoreActions((actions) => actions.createAccount);

  const { register, handleSubmit } = useForm<CreateAccountFormInputs>();

  const onSubmit: SubmitHandler<CreateAccountFormInputs> = ({
    username,
    password,
  }) => {
    createAccount({ username, password });
  };

  return (
    <div className="m-auto w-64 pt">
      <Link to="/login">
        <p className="text-sm text-center mt-1 mb-3">Login</p>
      </Link>

      <Box className="py-4 px-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            ref={register({ required: true })}
            className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            ref={register({ required: true })}
            className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <input
            type="submit"
            value="Create Account"
            className="w-full py-0.5 mt-4 border bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </form>
      </Box>
    </div>
  );
}

export default CreateAccount;
