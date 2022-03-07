import React, { useState, useEffect } from "react";
import "../css/todo.css";
import axios from "axios";

function Todo() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [toggleBtn, setToggleBtn] = useState(true);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/todos")
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setText(value);
  };

  const addTodo = () => {
    if (text === "") {
      alert("Write something first");
    } else if (text && !toggleBtn) {
      setTodos(
        todos.map((elem) => {
          if (elem._id === editItem) {
            return { ...elem, title: text };
          }
          return elem;
        })
      );
      setToggleBtn(true);
      setText("");
      setEditItem(null);
    } else {
      const newTodo = {
        _id: Date.now(),
        title: text,
      };

      setTodos(() => [newTodo, ...todos]);
      setText("");
    }
  };
  const handleSave = (e) => {
    const { code } = e;
    if (code === "Enter") {
      const newTodo = {
        _id: Date.now(),
        title: text,
      };
      if (text === "") {
        alert("Write something first");
      } else if (text && !toggleBtn) {
        setTodos(
          todos.map((elem) => {
            if (elem._id === editItem) {
              return { ...elem, title: text };
            }
            return elem;
          })
        );
        setToggleBtn(true);
        setText("");
        setEditItem(null);
      } else {
        setTodos((prevState) => [newTodo, ...prevState]);
        setText("");
      }
    }
  };

  const deleteTodo = (_id) => {
    const updateTodo = todos.filter((todos) => todos._id !== _id);
    setTodos(updateTodo);
  };

  const editTodo = (_id) => {
    const updateTodo = todos.find((todo) => todo._id === _id);

    setToggleBtn(false);
    setText(updateTodo.title);
    setEditItem(_id);
  };

  return (
    <div>
      <h1 className="header">Todo List by using MERN</h1>

      <div className="input-methode">
        <input
          className="input-data"
          type="text"
          placeholder="write todo here"
          value={text}
          onChange={handleChange}
          onKeyDownCapture={handleSave}
        />
        {toggleBtn ? (
          <i
            className="fa fa-lg fa-plus addBtn"
            aria-hidden="true"
            onClick={addTodo}
          ></i>
        ) : (
          <i
            className="fa  fa-lg fa-pencil-square-o addBtn "
            aria-hidden="true"
            onClick={addTodo}
          ></i>
        )}
      </div>
      <div className="item-div">
        {todos.map((todo) => (
          <div className="item-list" key={todo._id}>
            <input type="checkbox" className="check" checked={todo.done} />
            <span>{todo.title}</span>

            <i
              className="fa fa-lg fa-trash delBtn"
              aria-hidden="true"
              onClick={() => deleteTodo(todo._id)}
            ></i>
            <i
              className="fa fa-lg fa-pencil-square-o editBtn"
              aria-hidden="true"
              onClick={() => editTodo(todo._id)}
            ></i>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todo;
