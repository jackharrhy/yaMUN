import { useEffect, useState } from "react";

import { API_BASE } from "../api";

interface ILoginStatus {
  _id?: string;
  username?: string;
}

export default function useLoginStatus() {
  const [loginStatus, setLoginStatus] = useState<ILoginStatus>({});
  const [error, setError] = useState(null);

  const refetch = () => {
    let isMounted = true;
    fetch(`${API_BASE}/users`).then(async (res) => {
      if (!isMounted) return;
      const json = await res.json();

      if (res.ok) {
        setError(null);
        setLoginStatus(json);
      } else {
        setError(json.error);
        setLoginStatus({});
      }
    });
    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    refetch();
  }, []);

  return {
    refetch,
    id: loginStatus._id,
    username: loginStatus.username,
    error,
  };
}
