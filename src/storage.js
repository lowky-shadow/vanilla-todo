export const storeTodoInMemory = (todo) => {
  localStorage.setItem(JSON.stringify(todo.id), JSON.stringify(todo));
};

export const deleteTodoFromMemory = (id) => {
  localStorage.removeItem(id);
};

export const loadTodoFromMemory = (todos) => {
  todos.length = 0;
  const length = localStorage.length;
  for (let i = 0; i < length; i++) {
    let key = localStorage.key(i);
    const todo = JSON.parse(localStorage.getItem(key));
    todos.push(todo);
  }
};
