const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");

getTodos();

addBtn.addEventListener("click", () => {
    const todo = todoInput.value.trim();

    if (!todo) {
        alert("Please enter a todo");
        return;
    }

    addTodo(todo);
    todoInput.value = "";
});


function createTodoElement(id, text) {
  const div = document.createElement("div");
  div.className = "todo-item";
  div.innerHTML = `
    <p>${text}</p>
    <div>
      <button onclick="editTodo('${id}')">Edit</button>
      <button onclick="deleteTodo('${id}')">Delete</button>
    </div>
  `;
  return div;
}