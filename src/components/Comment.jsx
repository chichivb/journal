import { useState } from "react";

function Comment({ text }) {
  return (
    <>
      <li>
        <p>{text}</p>
      </li>
    </>
  );
}

export default Comment;
