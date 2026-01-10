import { renderUi } from "./renderUi.js";
import {  loadTodoLocal, saveTodoLocal } from "./storage.js";
import { addTodo, deleteTodo, editTodo } from "./todoLogic.js";

const main = async () => {
  let todos = [];

  let list = document.querySelector("#todo-selector");
  const form = document.querySelector("#form");

  //load todos from localstorage
  todos = loadTodoLocal();

  //sorting the todos before rendering
  todos.sort((a, b) => a.createdAt - b.createdAt);
  
  const callRenderUi = () => {
    renderUi(todos, list);
  };
  callRenderUi();

  list.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;

    if (e.target.classList.contains("delete")) {
      const idToDelete = e.target.dataset.id;
      todos = deleteTodo(todos, idToDelete);

      //saving todos local after delete
      saveTodoLocal(todos);
    } else if (e.target.classList.contains("edit")) {
      const idToEdit = e.target.dataset.id;

      const todo = todos.find((t) => t.id === idToEdit);
      todos.forEach((t) => (t.editing = false));
      if (todo) {
        todo.editing = true;
      }
    } else {
      return;
    }
    callRenderUi();
  });

  list.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || e.target.tagName !== "INPUT") return;

    const idToEdit = e.target.dataset.id;
    const editInput = e.target.value.trim();
    if (!editInput) return;

    todos = editTodo(todos, idToEdit, editInput);

    //save todos locally after edit
    saveTodoLocal(todos);
    callRenderUi();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.todo.value.trim();

    if (input.length > 20) {
      alert("Todo must be less than 20 characters");
      return;
    }
    addTodo(todos, input);

    //save todos locally after new todo
    saveTodoLocal(todos);
    callRenderUi();
    e.target.reset();
  });
};;
main();
