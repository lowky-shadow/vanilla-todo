import { renderUi } from "./renderUi.js";
import { addTodo,deleteTodo, editTodo } from "./todoLogic.js";

const main = async () => {
  let todos = [];
  
  let list = document.querySelector("#todo-selector");
  const form = document.querySelector("#form");

 const callRenderUi = ()=>{
  renderUi(todos,list);
 }

  list.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;

    if(e.target.classList.contains("delete")){
      const idToDelete = e.target.dataset.id;
      todos = deleteTodo(todos,idToDelete);

    }
    else if(e.target.classList.contains("edit")){
      const idToEdit = e.target.dataset.id;
      
      const todo = todos.find((t) => t.id === idToEdit);
      todos.forEach((t) => (t.editing = false));
      if (todo ) {
        todo.editing = true;
      }
      console.log(todo.editing);
      callRenderUi();
    }
    else{
      return;
    }
     callRenderUi();
  });

  list.addEventListener("keydown",(e)=>{
    if(e.key !== "Enter" || e.target.tagName !== "INPUT") return;

    const idToEdit = e.target.dataset.id;
    const editInput = e.target.value.trim();
    if(!editInput) return;

     todos = editTodo(todos, idToEdit, editInput);
    console.log(e.target.value);
     callRenderUi();
    console.log(e.target.value);
    
  })

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.todo.value.trim();
    addTodo(todos,input);
    callRenderUi();
    e.target.reset();
  });
};
main();
