import { api } from "./api.js";
import { renderUi } from "./renderUi.js";
// import { retryWithBackoff } from "./retryWithBackoff.js";
import { loadTodoLocal, saveTodoLocal } from "./storage.js";
import { addTodo, deleteTodo, editTodo, toggle } from "./todoLogic.js";
import { debounce } from "./utils.js";

const main = async () => {
  let todos = [];
  let searchTerm = "";

  let isLoading = false;
  let errorMessage = "";

  let lastFocusedTodoId = null;
  let activeFilter = "all";

  let actionStack = [];
  let undoTimeoutId = null;

  const UNDO_WINDOW_MS = 8000;
  const MAX_ACTIONS = 10;


  const list = document.querySelector("#todo-selector");
  const form = document.querySelector("#form");
  const searchInput = document.querySelector("#search");

  //load todos from localstorage and sort them before rendering
  todos = loadTodoLocal().sort((a, b) => a.createdAt - b.createdAt);

  const getVisibleTodos = () => {
    let result = todos;

    if (activeFilter === "pending") {
      result = result.filter((todo) => !todo.completed);
    }

    if (activeFilter === "completed") {
      result = result.filter((todo) => todo.completed);
    }

    if (searchTerm) {
      result = result.filter((todo) =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  };


  const render = () => {
    renderUi({ todos: getVisibleTodos(), list, isLoading, errorMessage });
    saveTodoLocal(todos);
  };
  render();

  const announce = (message) => {
    const region = document.querySelector("#sr-status");
    region.textContent = "";
    setTimeout(() => {
      region.textContent = message;
    }, 10);
  };


  //delete and edit TODO
  list.addEventListener("click",async (e) => {
    if (e.target.tagName !== "BUTTON" || isLoading) return;

    const id = e.target.dataset.id;

    if (e.target.classList.contains("delete")) {
      const index = todos.findIndex((t) => t.id === id);
      const todo = todos[index]; // FIX: capture BEFORE delete

      isLoading = true;
      errorMessage = "";
      render();
      try {
        await api.deleteTodo(id);
        todos = deleteTodo(todos, id);

        pushAction({ type: "DELETE", todo, index });

        saveTodoLocal(todos);
        announce("Todo deleted");

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
      lastFocusedTodoId = id; // the todo being edited
      todo.editing = true;
      announce("Editing todo");
    }
    render();
  });

  const restoreFocus = () => {
    if (lastFocusedTodoId == null) return;

    setTimeout(() => {
      const li = document.querySelector(`li[data-id="${lastFocusedTodoId}"]`);
      li?.focus();
      lastFocusedTodoId = null;
    }, 0);
  };


  //edit todo
  list.addEventListener("keydown", (e) => {
    if (e.target.tagName !== "INPUT") return;

    if (e.key === "Tab") {
      e.preventDefault();
      return;
    }

    if (e.key !== "Enter" && e.key !== "Escape") return;

    if (e.key === "Escape") {
      todos = todos.map((t) => ({ ...t, editing: false }));
      render();
      restoreFocus();
      announce("Edit canceled");
    }


    const idToEdit = e.target.dataset.id;
    const editInput = e.target.value.trim();

    if (!editInput) return;

    todos = editTodo(todos, idToEdit, editInput);
    saveTodoLocal(todos);
    render();
    restoreFocus();
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
      // await retryWithBackoff(async () => await api.addTodo(input));
      addTodo(todos, input);
      const todo = todos[todos.length-1];
      pushAction({ type: "ADD", todo });
      saveTodoLocal(todos);
    } catch (err) {
      errorMessage = err.message;
      console.log(err);
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

  //checkbox logic
  list.addEventListener("change",(e)=>{
    if(e.target.type !== "checkbox") return;
    todos = toggle(todos,e.target.dataset.id);
    saveTodoLocal(todos);
  })

  //filter logic
  const filters = document.getElementById("filters");

  filters.addEventListener("change", (e) => {
    if (!e.target.name === "filter") return;

    activeFilter = e.target.value;
    render();
  });

  //clear completed
  const clearCompletedBtn = document.querySelector("#clear-completed");

  clearCompletedBtn.addEventListener("click", () => {
    const removed = todos.filter((t) => t.completed);
    todos = todos.filter((todo) => !todo.completed);
    if (removed.length === 0) return;

     pushAction({ type: "CLEAR_COMPLETED", todos: removed });
     todos = todos.filter((t) => !t.completed);
     
    render();
  });

  //undo
  const undoBtn = document.querySelector("#undo");

  const undoLastAction = () => {
    const action = actionStack.pop();
    if (!action) return;

    switch (action.type) {
      case "ADD": {
        todos = todos.filter((todo) => todo.id !== action.todo.id);
        break;
      }

      case "DELETE": {
        todos.splice(action.index, 0, action.todo);
        break;
      }

      case "CLEAR_COMPLETED": {
        todos = [...todos, ...action.todos].sort(
          (a, b) => a.createdAt - b.createdAt
        );
        break;
      }
    }

    render();
    updateUndoUI();
  };


  undoBtn.addEventListener("click", () => {
    undoLastAction();
  });


  //undo helpers
  const pushAction = (action) => {
    actionStack.push(action);

    if (actionStack.length > MAX_ACTIONS) {
      actionStack.shift();
    }

    resetUndoTimer();
    updateUndoUI();
  };

  const resetUndoTimer = () => {
    clearTimeout(undoTimeoutId);

    undoTimeoutId = setTimeout(() => {
      actionStack = [];
      updateUndoUI();
    }, UNDO_WINDOW_MS);
  };

  const updateUndoUI = () => {
    undoBtn.disabled = actionStack.length === 0;
  };


};

main();
