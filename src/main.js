import { renderUi } from "./renderUi.js";
import { addTodo,deleteTodo } from "./todoLogic.js";

const main = async () => {
  let todos = [];

  let list = document.querySelector("#todo-selector");
  const form = document.querySelector("#form");

 const callRenderUi = ()=>{
  renderUi(todos,list);
 }

  list.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;

    const idToDelete = e.target.dataset.id;
    todos = deleteTodo(todos,idToDelete);
    callRenderUi();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.todo.value.trim();
    addTodo(todos,input);
    callRenderUi();
    e.target.reset();
  });
};
main();
