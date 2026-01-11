export const renderUi = (todos, list) => {
  list.innerHTML = "";

  for (let i = 0; i < todos.length; i++) {
    const li = document.createElement("li");

    if (todos[i].editing === true) {
      const inputbox = document.createElement("input");
      inputbox.dataset.id = todos[i].id;
      inputbox.value = todos[i].text;

      inputbox.setAttribute("aria-label", "Edit todo text");
      inputbox.setAttribute("aria-live", "polite");

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

      deleteButton.dataset.id = todos[i].id;

      const editButton = document.createElement("button");
      editButton.textContent = "edit";
      editButton.dataset.id = todos[i].id;
      editButton.setAttribute("class", "edit");
      editButton.setAttribute("aria-label", `Edit todo: ${todos[i].text}`);

      li.appendChild(deleteButton);
      li.appendChild(editButton);
    }

    list.appendChild(li);
  }
};
