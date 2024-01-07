import { useState, useEffect } from "react";
import "./App.css";

function useTodos() {
  const [allTodos, setAllTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const todosPerPage = 5; // Adjust the number of todos per page
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => {
        setAllTodos(data);
        const totalPages = Math.ceil(data.length / todosPerPage);
        setTotalPages(totalPages);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * todosPerPage;
    const endIndex = startIndex + todosPerPage;
    const slicedTodos = allTodos.slice(startIndex, endIndex);
    setFilteredTodos(slicedTodos);
  }, [allTodos, currentPage]);

  return { filteredTodos, totalPages };
}

function App() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { filteredTodos, totalPages } = useTodos();
  const nearbyPages = 2; // Number of nearby pages to show

  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const generatePagination = () => {
    const paginationButtons = [];

    let startPage = Math.max(1, currentPage - nearbyPages);
    let endPage = Math.min(totalPages, currentPage + nearbyPages);

    for (let i = startPage; i <= endPage; i++) {
      paginationButtons.push(
        <button
          key={i}
          onClick={() => changePage(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    return paginationButtons;
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
          {filteredTodos.map((todo) => (
            <li key={todo.id}>
              <strong>{todo.title}</strong>
              <p className={todo.completed ? "completed" : "incomplete"}>
                {todo.completed ? "Completed" : "Incomplete"}
              </p>
            </li>
          ))}
        </ul>

        <div className="pagination">{generatePagination()}</div>
      </div>
    </div>
  );
}

export default App;
