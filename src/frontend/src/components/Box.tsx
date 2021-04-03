import React from "react";

function Box({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div style={style} className={`shadow-md rounded border ${className}`}>
      {children}
    </div>
  );
}

export default Box;
