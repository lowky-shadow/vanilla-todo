const KEY = "todos_v1";

export const saveTodoLocal = (todos) => {
  localStorage.setItem(KEY, JSON.stringify(todos));
};

export const loadTodoLocal = () => {
  const raw = localStorage.getItem(KEY);
 if(!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)? parsed : [];
  }
  catch{
    return [];
  }
};