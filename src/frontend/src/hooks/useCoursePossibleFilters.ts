import { useEffect, useState } from "react";

import { IPossibleFilters } from "../../../backend/api/controllers/courses";
import { API_BASE } from "../api";

export default function useCoursePossibleFilters() {
  const [
    possibleFilters,
    setPossibleFilters,
  ] = useState<IPossibleFilters | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE}/course-filters`).then(async (res) => {
      if (!isMounted) return;

      const json = await res.json();

      if (res.ok) {
        setError(null);
        setPossibleFilters(json);
      } else {
        setPossibleFilters(null);
        setError(json.error);
      }
    });

    return () => { isMounted = false };
  }, []);

  return { possibleFilters, error };
}
