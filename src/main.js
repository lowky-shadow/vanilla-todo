import { api } from "./api.js";
import { renderUi } from "./renderUi.js";
import { retryWithBackoff } from "./retryWithBackoff.js";
import { loadTodoLocal, saveTodoLocal } from "./storage.js";
import { addTodo, deleteTodo, editTodo } from "./todoLogic.js";
import { debounce } from "./utils.js";

const main = async () => {
  let todos = [];
  let searchTerm = "";

  let isLoading = false;
  let errorMessage = "";

  const list = document.querySelector("#todo-selector");
  const form = document.querySelector("#form");
  const searchInput = document.querySelector("#search");

  //load todos from localstorage and sort them before rendering
  todos = loadTodoLocal().sort((a, b) => a.createdAt - b.createdAt);

  const getVisibleTodos = () => {
    return todos.filter((todo) =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const render = () => {
    renderUi({ todos: getVisibleTodos(), list, isLoading, errorMessage });
  };
  render();

  //delete and edit TODO
  list.addEventListener("click",async (e) => {
    if (e.target.tagName !== "BUTTON" || isLoading) return;

    const id = e.target.dataset.id;

    if (e.target.classList.contains("delete")) {
      isLoading = true;
      errorMessage = "";
      render();
      try {
        await api.deleteTodo(id);
        todos = deleteTodo(todos, id);
        saveTodoLocal(todos);
      } catch (err) {
        errorMessage = err.message;
      }
      finally{
        isLoading = false;
        render();
      }
    }

    if (e.target.classList.contains("edit")) {
    
      const todo = todos.find((t) => t.id === id);
      todos.forEach((t) => (t.editing = false));
      if (todo) {
        todo.editing = true;
      }
    } else {
      return;
    }
    render();
  });

  //edit todo
  list.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || e.target.tagName !== "INPUT") return;

    const idToEdit = e.target.dataset.id;
    const editInput = e.target.value.trim();

    if (!editInput) return;

    todos = editTodo(todos, idToEdit, editInput);
    saveTodoLocal(todos);
    render();
  });


  //add todo
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isLoading) return;
    const input = e.target.todo.value.trim();
    if (!input) return;

    isLoading = true;
    errorMessage = "";
    render();

    try {
      if (input.length > 20) {
        alert("Todo must be less than 20 characters");
        return;
      }
      await retryWithBackoff(async () => await api.addTodo(input));
      addTodo(todos, input);
      saveTodoLocal(todos);
      
    } catch (err) {
      errorMessage = err.message;
    } finally {
      isLoading = false;
      e.target.reset();
      render();
    }
  });

  const handleSearch = debounce((value) => {
    searchTerm = value;
    render();
  }, 500);

  searchInput.addEventListener("input", (e) => {
    handleSearch(e.target.value);
  });
};

main();
