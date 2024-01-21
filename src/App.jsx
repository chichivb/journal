import { useState, useEffect, useMemo, useRef } from "react";
import { AiOutlineCheck } from "react-icons/ai"; // Importing an example icon
import { IoIosMoon, IoIosSunny } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { MdAdd } from "react-icons/md";
import "./App.css";

function useTodos() {
  const [allTodos, setAllTodos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const todosPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [newTodo, setNewTodo] = useState("");
  const formRef = useRef(null);

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

  const startIndex = (currentPage - 1) * todosPerPage;
  const endIndex = startIndex + todosPerPage;
  const filteredTodos = useMemo(
    () => allTodos.slice(startIndex, endIndex),
    [allTodos, startIndex, endIndex]
  );

  const handleNewTodoChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim() !== "") {
      const newTodoItem = {
        id: allTodos.length + 1,
        title: newTodo,
        completed: false,
      };
      allTodos.unshift(newTodoItem); // Add the new todo at the beginning of the array
      setAllTodos([...allTodos]); // Trigger a state update by creating a new reference
      setNewTodo("");
      formRef.current.reset();
    }
  };

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   if (newTodo.trim() !== "") {
  //     setAllTodos([
  //       ...allTodos,
  //       { id: allTodos.length + 1, title: newTodo, completed: false },
  //     ]);
  //     setNewTodo("");
  //     formRef.current.reset();
  //   }
  //   console.log("filteredTodos:", filteredTodos);
  //   console.log("newTodo:", newTodo);
  //   console.log("currentPage:", currentPage);
  // };

  return {
    filteredTodos,
    totalPages,
    currentPage,
    setCurrentPage,
    newTodo,
    handleNewTodoChange,
    handleFormSubmit,
    formRef,
  };
}

function App() {
  const [darkTheme, setDarkTheme] = useState(false);

  const {
    filteredTodos,
    totalPages,
    currentPage,
    setCurrentPage,
    newTodo,
    handleNewTodoChange,
    handleFormSubmit,
    formRef,
  } = useTodos();
  const nearbyPages = 2;

  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const generatePagination = useMemo(() => {
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
  }, [currentPage, totalPages, nearbyPages, changePage]);

  return (
    <div className={`container ${darkTheme ? "dark" : ""}`}>
      <h1>Journal</h1>
      <div className="theme-toggle">
        <label>
          {darkTheme ? <IoIosMoon /> : <IoIosSunny />}
          <input type="checkbox" checked={darkTheme} onChange={toggleTheme} />
          Dark Theme
        </label>
      </div>
      <div>
        <form ref={formRef} onSubmit={handleFormSubmit}>
          <label>
            New Todo:
            <input type="text" value={newTodo} onChange={handleNewTodoChange} />
          </label>
          <button type="submit">
            <MdAdd /> Add Todo
          </button>
        </form>

        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id}>
              <strong>{todo.title}</strong>
              {todo.completed ? (
                <p className="completed">
                  <AiOutlineCheck /> Completed
                </p>
              ) : (
                <p className="incomplete">
                  <IoIosClose /> Incomplete
                </p>
              )}
            </li>
          ))}
        </ul>

        <div className="pagination">{generatePagination}</div>
      </div>
    </div>
  );
}

export default App;
