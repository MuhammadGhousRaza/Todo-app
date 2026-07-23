import { supabaseClient } from "./supabaseClient.js";

// page: 1-based page number, pageSize: number of items per page
export async function addTodo(todo, page = 1, pageSize = 8) {
  const { error } = await supabaseClient
    .from("todos")
    .insert({
      title: todo,
    });

  if (error) {
    console.log("Error adding todo:", error);
    return { error };
  }

  return await getTodos(page, pageSize);
}

export async function getTodos(page = 1, pageSize = 8) {
  const todoList = document.querySelector("#todoList");
  if (!todoList) return { data: [], count: 0 };
  todoList.innerHTML = "";

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await supabaseClient
    .from("todos")
    .select("*", { count: "exact" })
    .order("id", { ascending: true })
    .range(start, end);

  if (error) {
    console.log("Error fetching todos:", error);
    todoList.innerHTML = `<p style="text-align: center; color: var(--text-muted, #94a3b8); padding: 20px;">Unable to load tasks.</p>`;
    return { data: [], count: 0 };
  }

  // Empty state check
  if (!data || data.length === 0) {
    todoList.innerHTML = `<p style="text-align: center; color: var(--text-muted, #94a3b8); padding: 20px;">No tasks yet. Add one above!</p>`;
    return { data: [], count: count || 0 };
  }

  data.forEach((item) => {
    const todoCard = document.createElement("div");
    todoCard.className = "todo-item";

    const textPara = document.createElement("p");
    textPara.textContent = item.title;

    const btnGroup = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTodo(item.id, item.title, page, pageSize);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTodo(item.id, page, pageSize);

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    todoCard.appendChild(textPara);
    todoCard.appendChild(btnGroup);

    todoList.appendChild(todoCard);
  });

  return { data, count: count || 0 };
}

export async function deleteTodo(id, page = 1, pageSize = 8) {
  const { error } = await supabaseClient
    .from("todos")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("Error deleting todo:", error);
    return { error };
  }

  return await getTodos(page, pageSize);
}

export async function editTodo(id, oldTitle, page = 1, pageSize = 8) {
  const newTitle = prompt("Update Todo", oldTitle);

  if (newTitle === null || newTitle.trim() === "") return { cancelled: true };

  const { error } = await supabaseClient
    .from("todos")
    .update({
      title: newTitle.trim(),
    })
    .eq("id", id);

  if (error) {
    console.log("Error updating todo:", error);
    return { error };
  }

  return await getTodos(page, pageSize);
}