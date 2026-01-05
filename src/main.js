const main = async () => {
  let j = 0;
  let todos = [];

  let list = document.querySelector("#todo-selector");
  const form = document.querySelector("#form");

  const renderUi = ()=>{
    list.innerHTML = "";
    
    for(let i = 0;i<todos.length;i++){
      const li = document.createElement("li");
      li.textContent = todos[i].text + " ";
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "delete";
       deleteButton.dataset.id = todos[i].id;
      
      deleteButton.setAttribute("class","delete");
      li.appendChild(deleteButton);
      list.appendChild(li);
      console.log("rendered");
    }
  };

  list.addEventListener("click",(e)=>{
    if(e.target.tagName !== "BUTTON") return;
    
    const idToDelete = Number(e.target.dataset.id);
    todos = todos.filter((todo) => todo.id !== idToDelete);
    console.log(todos);
    renderUi();
  })

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const input = e.target.todo.value.trim();
    
    todos.push({id:j++,text:input});

     renderUi();

    e.target.reset();
    //console.log(todos);
  });

};
main();
