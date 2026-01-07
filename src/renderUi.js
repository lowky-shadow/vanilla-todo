export  const renderUi = (todos,list) => {
    list.innerHTML = "";

    for (let i = 0; i < todos.length; i++) {
      const li = document.createElement("li");
      li.textContent = todos[i].text + " ";
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "delete";
      deleteButton.dataset.id = todos[i].id;

      li.appendChild(deleteButton);
      list.appendChild(li);
    }
  };