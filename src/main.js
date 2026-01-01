console.log("app started")
let arr =[];
let a = document.querySelector("#todo-selector");

arr.push("mango bring");
arr.push("bring apple");

for(let i = 0; i < arr.length; i++){
  let li = document.createElement("li");
  li.textContent = arr[i];
  a.appendChild(li);

}