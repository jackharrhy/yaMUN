import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useStoreActions } from "../store";
import Box from "./Box";

function Login() {
  // TODO use react-hook-form
  const login = useStoreActions((actions) => actions.login);

  const disabled = false; // TODO have a state in the store for when this request is being made, to disable buttons

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const attemptLogin = () => {
    if (username === "" || password === "") return;
    login({ username, password });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      attemptLogin();
    }
  };

  return (
    <div className="m-auto w-64 pt-2">
      <Box className="py-4 px-5">
        <input
          className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          placeholder="Username"
          disabled={disabled}
          value={username}
          onChange={onUsernameChange}
          onKeyPress={handleKeyPress}
        />
        <input
          className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          type="password"
          placeholder="Password"
          disabled={disabled}
          value={password}
          onChange={onPasswordChange}
          onKeyPress={handleKeyPress}
        />
        <input
          className="w-full py-0.5 mt-4 border bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
          type="submit"
          value="Login"
          disabled={disabled}
          onClick={attemptLogin}
        />
        <Link to="/create-account">
          <p className="text-sm text-center mt-3">Create an account</p>
        </Link>
      </Box>
    </div>
  );
}

export default Login;
