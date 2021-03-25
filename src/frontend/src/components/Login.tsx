import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { useStoreActions } from "../store";
import Box from "./Box";

type LoginFormInputs = {
  username: string;
  password: string;
};

function Login() {
  const login = useStoreActions((actions) => actions.login);

  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = ({ username, password }) => {
    login({ username, password });
  };

  /*
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      attemptLogin();
    }
  }
  */

  return (
    <div className="m-auto w-64 pt-2">
      <Box className="py-4 px-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            name="username"
            placeholder="Login"
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
            value="Login"
            className="w-full py-0.5 mt-4 border bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </form>
        <Link to="/create-account">
          <p className="text-sm text-center mt-3">Create Account</p>
        </Link>
      </Box>
    </div>
  );
}

export default Login;
