import React, { useState, useEffect } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import "../css/todo.css";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  cancelBtn: {
    fontSize: 17,
    padding: "0 4px 0 4px",
    marginBottom: -2,
    cursor: "pointer",
    marginRight: 5,
  },
});

const URL = "http://localhost:8080/todos";

function Todo() {
  const classes = useStyles();

  const [currentTodo, setCurrentTodo] = useState({ title: "" });
  const [todos, setTodos] = useState([]);

  // true - Editing old item or false - adding new
  const [isEditing, setIsEditing] = useState(false);
  // const [isCancel, setIsCancel] = useState(false);

  const handleChange = (event) => {
    const value = event.target.value;
    // setText();
    setCurrentTodo((prevState) => ({
      ...prevState,
      title: value,
    }));
  };

  const handleSave = (e) => {
    const { code } = e;

    if (code !== "Enter") return;

    const { title } = currentTodo;

    if (title === "") {
      alert("Write something first");
      return;
    }

    axios
      .post(URL, { title })
      .then((response) => {
        const { _id, title } = response.data;
        setTodos((prevState) => [{ _id, title }, ...prevState]);
        setCurrentTodo({ title: "" });
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    const deleteURL = `${URL}/${id}`;
    axios
      .delete(deleteURL)
      .then((response) => {
        const updateTodo = todos.filter((todo) => todo._id !== id);
        setTodos(updateTodo);
      })
      .catch((err) => console.log(err));
  };

  const handleEditSave = (e) => {
    // Saving edited
    const { code } = e;

    if (code !== "Enter") return;
    const { _id, title } = currentTodo;

    const updateUrl = `${URL}/${_id}`;
    axios
      .patch(updateUrl, { title })
      .then(() => {
        setTodos((prevState) =>
          prevState.map((todo) => (todo._id === _id ? { _id, title } : todo))
        );
        setCurrentTodo({ title: "" });
        setIsEditing(false);
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (_id) => {
    const updateTodo = todos.find((todo) => todo._id === _id);
    setCurrentTodo(updateTodo);
    setIsEditing(true);
  };

  const handleStatusUpdate = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo._id === id ? { ...todo, done: true } : todo
    );
    setTodos(updatedTodos);
  };

  // Erase  all  text in input on click
  const handleCancel = () => {
    setCurrentTodo({ title: "" });
    setIsEditing(false);
  };

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

  return (
    <div>
      <h1 className="header">Todo List by using MERN</h1>

      <div className="input-methode">
        <input
          className="input-data"
          type="text"
          placeholder="write todo here"
          value={currentTodo.title}
          autoComplete="on"
          onChange={handleChange}
          onKeyDownCapture={!isEditing ? handleSave : handleEditSave}
        />

        <span>
          {currentTodo.title === "" ? null : (
            <ClearIcon className={classes.cancelBtn} onClick={handleCancel} />
          )}
        </span>
        <span>
          {isEditing ? (
            <i
              className="fa  fa-pencil-square-o addBtn"
              aria-hidden="true"
              onClick={handleEditSave}
            ></i>
          ) : (
            <i
              className="fa   fa-plus addBtn "
              aria-hidden="true"
              onClick={() => handleSave({ code: "Enter" })}
            ></i>
          )}
        </span>
      </div>
      <div className="item-div">
        {todos.map((todo) => {
          const { _id, title, done = false } = todo;
          return (
            <div className="item-list" key={todo._id}>
              <input
                type="checkbox"
                className="check"
                checked={done}
                onChange={() => handleStatusUpdate(_id)}
              />
              <span style={{ textDecoration: done ? "line-through" : "" }}>
                {title}
              </span>

              <i
                className="fa fa-lg fa-trash delBtn"
                aria-hidden="true"
                onClick={() => handleDelete(_id)}
              ></i>

              <i
                className="fa fa-lg fa-pencil-square-o editBtn"
                aria-hidden="true"
                onClick={() => handleEdit(_id)}
              ></i>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Todo;
