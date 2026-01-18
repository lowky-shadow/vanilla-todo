export const renderUi = ({todos, list,isLoading,errorMessage}) => {
  list.innerHTML = "";

  for (let i = 0; i < todos.length; i++) {
    const li = document.createElement("li");
    li.dataset.id = todos[i].id;
    if (todos[i].editing === true) {
      const inputbox = document.createElement("input");
      inputbox.dataset.id = todos[i].id;
      inputbox.value = todos[i].text;
      inputbox.disabled = isLoading;

      inputbox.setAttribute("aria-label", "Edit todo text");

      li.appendChild(inputbox);
      setTimeout(() => {
        inputbox.focus();
        inputbox.setSelectionRange(inputbox.value.length, inputbox.value.length);
      }, 0);
    } else {
      li.textContent = todos[i].text + " ";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "delete";
      deleteButton.setAttribute("class", "delete");
      deleteButton.setAttribute("aria-label", `Delete todo: ${todos[i].text}`);
      deleteButton.disabled = isLoading;

      deleteButton.dataset.id = todos[i].id;

      const editButton = document.createElement("button");
      editButton.textContent = "edit";
      editButton.dataset.id = todos[i].id;
      editButton.setAttribute("class", "edit");
      editButton.setAttribute("aria-label", `Edit todo: ${todos[i].text}`);
      editButton.disabled = isLoading;

      li.appendChild(deleteButton);
      li.appendChild(editButton);
    }
    li.setAttribute("tabindex", "0");

    list.appendChild(li);
  }

   const status = document.querySelector("#status");
   status.textContent = isLoading ? "isLoading" : errorMessage || "";
};
