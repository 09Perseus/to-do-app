import { useState, useEffect } from "react";

//Defining the interface of the to-do useState variable
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

//Defining variable to store the API URL for the backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  //Defining useState variables to store the to-do list and the input of a to-do
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");

  //Fetch the todo list
  useEffect(() => {
    fetch(`${API_URL}/api/todos`)
      .then((res) => res.json())
      .then((data: Todo[]) => setTodos(data));
  }, []);

  //Add a todo
  function addToDo(): void {
    //Making sure a blank to-do can't be added
    if (!input.trim()) return;

    //Sending a POST request to add the to-do to the list
    fetch(`${API_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    })
      .then((res) => res.json())
      .then((todo: Todo) => {
        setTodos([...todos, todo]);
        setInput("");
      });
  }

  //Mark a to-do complete or incomplete
  function toggleToDo(id: number): void {
    fetch(`${API_URL}/api/todos/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data: Todo) => {
        setTodos(todos.map((t) => (t.id === id ? data : t)));
      });
  }

  //Delete a to-do
  function deleteToDo(id: number): void {
    fetch(`${API_URL}/api/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data: Todo[]) => {
        setTodos(data);
      });
  }

  return (
    <>
      <div>
        <h1>To-do List</h1>
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          placeholder="Enter a to-do"
        />
        <button onClick={addToDo}>Add</button>
      </div>
      <div>
        <ul style={{ listStyleType: "none" }}>
          {todos.map((todo: Todo) => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleToDo(todo.id)}
              />
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
              >
                {todo.text}
              </span>
              <button onClick={() => deleteToDo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
