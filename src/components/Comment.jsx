import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "./Comment.css";

function Comment({ text }) {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <li className={theme === "light" ? "lightTheme" : "darkTheme"}>{text}</li>
    </>
  );
}

export default Comment;
