import React from "react";

type DisplayErrorProps = {
  error: string | null;
};

function DisplayError({ error }: DisplayErrorProps) {
  if (error === null) {
    return null;
  }

  return <p className="m-4 text-md text-center text-red-900 font-bold">{error}</p>;
}

export default DisplayError;
