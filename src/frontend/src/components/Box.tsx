import React from "react";

function Box({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`shadow-md rounded border ${className}`}>{children}</div>
  );
}

export default Box;
