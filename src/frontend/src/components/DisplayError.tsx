import React from "react";

type DisplayErrorProps = {
  error: string | null;
};

function DisplayError({ error }: DisplayErrorProps) {
  if (error === null) {
    return null;
  }

  return (
    <p className="text-md text-red-900 font-bold">{error}</p>
  );
}

export default DisplayError;
