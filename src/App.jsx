import { useState, useEffect } from "react";
import "./App.css";

function useTodos() {
  const [documents, setDocuments] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTodos = async (page) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos?_page=${page}`
      );
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos(1); // Initial fetch
  }, []);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => {
        const totalPages = Math.ceil(data.length / 10); // Assuming 10 todos per page
        setTotalPages(totalPages);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  return { documents, totalPages, fetchTodos };
}

function App() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { documents, totalPages, fetchTodos } = useTodos();

  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  const changePage = (page) => {
    setCurrentPage(page);
    fetchTodos(page);
  };

  // Function to generate pagination buttons for nearby pages
  const generatePagination = () => {
    const nearbyPages = [];
    const totalButtonsToShow = 5; // Number of buttons to show

    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(totalPages, currentPage + 2);
      i++
    ) {
      nearbyPages.push(
        <button
          key={i}
          onClick={() => changePage(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    return nearbyPages;
  };

  return (
    <div className={`container ${darkTheme ? "dark" : ""}`}>
      <h1>Journal</h1>
      <div className="theme-toggle">
        <label>
          <input type="checkbox" checked={darkTheme} onChange={toggleTheme} />
          Dark Theme
        </label>
      </div>
      <div>
        <ul className="todo-list">
          {documents.map((todo) => (
            <li key={todo.id}>
              <strong>{todo.title}</strong>
              <p>{todo.completed ? "Completed" : "Incomplete"}</p>
            </li>
          ))}
        </ul>

        <div className="pagination">{generatePagination()}</div>
      </div>
    </div>
  );
}

export default App;
