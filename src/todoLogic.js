import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";

export const addTodo = (todos, input) => {
  const todo = {
    id: nanoid(),
    text: input,
    completed: false,
    createdAt: Date.now(),
    editing:false,
  };
  todos.push(todo);
};

export const deleteTodo = (todos,idToDelete) => {
  return todos.filter((todo) => todo.id !== idToDelete);
};


export const editTodo = (todos,idToEdit,input) =>{
  return todos.map((todo) =>{
    if(todo.id !== idToEdit) return todo;

    return {
      ...todo,
      text:input,
      editing:false,
    }
  })
}