import React from "react";

export function LogoLavaJato(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="lavajato3.png"
      alt="Logo"
      className={props.className}
      style={{ width: 24, height: 24, objectFit: "contain" }}
      {...props}
    />
  );
}