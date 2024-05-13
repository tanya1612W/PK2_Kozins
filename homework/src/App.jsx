import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeTasksCount, setActiveTasksCount] = useState(0);

  useEffect(() => {
    // Загрузка задач с fake API
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(response => response.json())
      .then(data => {
        setTasks(data);
        setActiveTasksCount(data.filter(task => !task.completed).length);
      })
      .catch(error => console.error("Error fetching tasks:", error));

    // Загрузка пользователей с fake API
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    if (filter === "active") {
      setActiveTasksCount(tasks.filter(task => !task.completed).length);
    } else if (filter === "completed") {
      setActiveTasksCount(tasks.filter(task => task.completed).length);
    } else {
      setActiveTasksCount(tasks.length);
    }
  }, [tasks, filter]);

  const addTask = (text) => {
    if (text.trim() !== "") {
      setTasks([...tasks, { id: tasks.length, title: text, completed: false }]);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const editTask = (taskId, taskText) => {
    setEditTaskId(taskId);
    setEditTaskText(taskText);
  };

  const saveEdit = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: editTaskText } : task
    ));
    setEditTaskId(null);
    setEditTaskText("");
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getUsernameById = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : "Unknown User";
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") {
      return !task.completed;
    } else if (filter === "completed") {
      return task.completed;
    } else {
      return true;
    }
  });


  return (
    <div className="todoapp stack-large">
      <h1>ToDo Guseynov R.</h1>
      <form onSubmit={(e) => { e.preventDefault(); addTask(e.target.elements[0].value); e.target.reset(); }}>
        <h2 className="label-wrapper">
          <label htmlFor="new-todo-input" className="label__lg">
            It's my PK2
          </label>
        </h2>
        <input
          type="text"
          id="new-todo-input"
          className="input input__lg"
          name="text"
          autoComplete="off"
        />
        <button type="submit" className="btn btn__primary btn__lg">
          Add
        </button>
      </form>
      <div className="filters btn-group stack-exception">
        <button type="button" className={`btn toggle-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter("all")}>
          <span className="visually-hidden">Show </span>
          <span>All</span>
          <span className="visually-hidden"> tasks</span>
        </button>
        <button type="button" className={`btn toggle-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter("active")}>
          <span className="visually-hidden">Show </span>
          <span>Active</span>
          <span className="visually-hidden"> tasks</span>
        </button>
        <button type="button" className={`btn toggle-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter("completed")}>
          <span className="visually-hidden">Show </span>
          <span>Completed</span>
          <span className="visually-hidden"> tasks</span>
        </button>
      </div>
      <h2 id="list-heading">Tasks remaining: {activeTasksCount}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {filteredTasks.map(task => (
          <li key={task.id} className="todo stack-small">
            <div className="c-cb">
              <input
                id={`todo-${task.id}`}
                type="checkbox"
                defaultChecked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <label className="todo-label" htmlFor={`todo-${task.id}`}>
                {editTaskId === task.id ? (
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                  />
                ) : (
                  <>
                    <div>{task.title}</div>
                    <div className="username">({getUsernameById(task.userId)})</div>
                  </>
                )}
              </label>
            </div>
            <div className="todo-actions">
              <div className="btn-group">
                {editTaskId === task.id ? (
                  <>
                    <button type="button" className="btn" onClick={() => saveEdit(task.id)}>
                      Save
                    </button>
                    <button type="button" className="btn btn__danger" onClick={() => setEditTaskId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn" onClick={() => editTask(task.id, task.title)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn__danger" onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
