import React, { FC } from "react";
import "./Spinner.css";

type SpinnerProps = {
  //   animationDuration: any;
  size: any;
  color: any;
};

export const Spinner: FC<SpinnerProps> = function Spinner({
  //   animationDuration,
  size,
  color,
}) {
  return (
    <div
      className="half-circle-spinner"
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
    >
      <div
        className="circle circle-1"
        style={{
          borderWidth: `${size / 10}px`,
          animationDuration: `1000ms`,
          borderTopColor: color,
        }}
      />
      <div
        className="circle circle-2"
        style={{
          borderWidth: `${size / 10}px`,
          animationDuration: `1000ms`,
          borderBottomColor: color,
        }}
      />
    </div>
  );
};

Spinner.defaultProps = {
  //   animationDuration: 1000,
  size: 40,
  color: "#2c6fa5",
};
