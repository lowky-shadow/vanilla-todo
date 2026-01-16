const randomDelay = ()=>{
  return new Promise(resolve => setTimeout(resolve,500+ Math.random() *1000));
}

const maybeFail = ()=>{
  if(Math.random() > 0.2)
    return Promise.reject(new Error("Network Error"));

};


export const api = {
  async addTodo(todo){
    await randomDelay();
    maybeFail();
    return todo;
  },

  async deleteTodo(id){
    await randomDelay();
    maybeFail();
    return id;
  }
}