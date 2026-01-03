const main = async () => {
  console.log("app started");
  let arr = [];
  let a = document.querySelector("#todo-selector");

  arr.push("mango bring");
  arr.push("bring apple");

  const form = document.querySelector("#form");

   form.addEventListener("submit", (e) => {
    e.preventDefault();
    // const input = document.querySelector("#input_todo");
    const input = e.target.todo.value;
    arr.push(input);
  });
  console.log(arr);

  for (let i = 0; i < arr.length; i++) {
    let li = document.createElement("li");
    li.textContent = arr[i];
    a.appendChild(li);
  }
};
main();
