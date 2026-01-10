import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
import { deleteTodoFromMemory, editTodoInMemory, storeTodoInMemory } from "./storage.js";

export const addTodo = (todos, input) => {
  const todo = {
    id: nanoid(),
    text: input,
    completed: false,
    createdAt: Date.now(),
    editing:false,
  };
  todos.push(todo);
  storeTodoInMemory(todo);
};

export const deleteTodo = (todos,idToDelete) => {
  deleteTodoFromMemory(JSON.stringify(idToDelete));
  return todos.filter((todo) => todo.id !== idToDelete);
};


export const editTodo = (todos,idToEdit,input) =>{
  return todos.map((todo) =>{
    if(todo.id !== idToEdit) return todo;

    const newTodo = {
      ...todo,
      text: input,
      editing: false,
    };

    editTodoInMemory(idToEdit,newTodo);
    return newTodo;
  })
}