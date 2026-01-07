import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";

export const addTodo = (todos, input) => {
  const todo = {
    id: nanoid(),
    text: input,
    completed: false,
    createdAt: Date.now(),
  };
  todos.push(todo);
};

export const deleteTodo = (todos,idToDelete) => {
  return todos.filter((todo) => todo.id !== idToDelete);
};
