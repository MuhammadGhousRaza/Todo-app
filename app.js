import { addTodo, getTodos } from "./crud.js";

const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const prevBtn = document.querySelector("#prevPage");
const nextBtn = document.querySelector("#nextPage");
const pageInfo = document.querySelector("#pageInfo");

let currentPage = 1;
const pageSize = 8;

async function loadPage(page = 1) {
  currentPage = page;
  const res = await getTodos(currentPage, pageSize);
  const total = res && res.count ? res.count : 0;
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

addBtn.addEventListener("click", async () => {
  const todo = todoInput.value.trim();

  if (!todo) {
    alert("Please enter a todo");
    return;
  }

  await addTodo(todo, currentPage, pageSize);
  todoInput.value = "";
  await loadPage(currentPage);
});

if (prevBtn) {
  prevBtn.addEventListener("click", async () => {
    if (currentPage > 1) {
      await loadPage(currentPage - 1);
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", async () => {
    await loadPage(currentPage + 1);
  });
}

// Initial load
loadPage(1);