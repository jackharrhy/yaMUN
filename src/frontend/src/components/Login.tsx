import React, { useState } from "react";

import { API_BASE, postData } from "../api";
import Box from "./Box";
import DisplayError from "./DisplayError";

function Login({ refetchLoginStatus }: { refetchLoginStatus: () => void }) {
  const [error, setError] = useState(null);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const disabled = loading;

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const attemptLogin = () => {
    if (username === "" || password === "") return;

    setLoading(true);
    postData(`${API_BASE}/login`, { username, password }).then(async (resp) => {
      if (resp.ok) {
        refetchLoginStatus();
      } else {
        const json = await resp.json();
        setError(json.error);
      }

      setLoading(false);
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      attemptLogin();
    }
  };

  return (
    <div className="m-auto w-64 pt-2">
      <Box className="pt-4 pb-5 px-5">
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
      </Box>
      <DisplayError error={error} />
    </div>
  );
}

export default Login;
