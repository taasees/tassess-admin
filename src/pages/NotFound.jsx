import React from "react";
import not_found from "../assets/icons/undraw_page-not-found_6wni.svg";
export default function NotFound() {
  return (
    <div
      style={{
        width: "100dvw",
        height: "100dvh",
        display: "grid",
        placeContent: "center",
        fontSize: "5rem",
        textTransform: "uppercase",
        color: "goldenrod",
        background: "#fff",
      }}
    >
      <img src={not_found} alt="" />
    </div>
  );
}
