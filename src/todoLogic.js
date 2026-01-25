import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";

export const addTodo = (todos, input) => {
  // if(input.length > 5) 
  //   throw new Error("input too long");
  const todo = {
    id: nanoid(),
    text: input,
    completed: false,
    createdAt: Date.now(),
    editing: false,
  };
  todos.push(todo);
};

export const deleteTodo = (todos, idToDelete) => {
  return todos.filter((todo) => todo.id !== idToDelete);
};

export const editTodo = (todos, idToEdit, input) => {
  return todos.map((todo) => {
    if (todo.id !== idToEdit) return todo;

    return {
      ...todo,
      text: input,
      editing: false,
    };
  });
};

export const toggle = (todos, idToToggle) => {
  return todos.map((todo) => {
    if (todo.id !== idToToggle) return todo;

    return {
      ...todo,
      completed: !todo.completed,
    };
  });
};
