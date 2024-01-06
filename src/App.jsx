import { useState } from "react";
import "./App.css";
import Comment from "./components/Comment";

function App() {
  const [documents, setDocuments] = useState([]);
  const [comment, setComment] = useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    console.log(comment);

    setDocuments((prevItems) => [...prevItems, comment]);
    setComment("");
  };

  return (
    <>
      <div className="container">
        <h1>Journal</h1>
        <h2>What do you wish to document:</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div>
        <ul>
          {documents.map((document) => (
            <Comment text={document}></Comment>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
