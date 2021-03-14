import { useEffect, useState } from "react";

import { API_BASE } from "../api";

export default function useLoginStatus() {
  const [error, setError] = useState(null);

  const refetch = () => {
    let isMounted = true;
    fetch(`${API_BASE}/users`).then(async (res) => {
      if (!isMounted) return;
      const json = await res.json();
      console.log(json);

      if (res.ok) {
        setError(null);
      } else {
        setError(json.error);
      }
    });
    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    refetch();
  }, []);

  return { refetch, error };
}
