async function addTodo(todo) {
    const { error } = await supabaseClient
        .from("todos")
        .insert({
            title: todo
        });

    if (error) {
        console.log("Error adding todo:", error);
        return;
    }

    getTodos();
}

async function getTodos() {
    const todoList = document.querySelector("#todoList");
    todoList.innerHTML = "";

    const { data, error } = await supabaseClient
        .from("todos")
        .select("*")
        .order("id", { ascending: true }); // ID ke hisab se sort karega

    if (error) {
        console.log("Error fetching todos:", error);
        return;
    }

    // Empty state check
    if (!data || data.length === 0) {
        todoList.innerHTML = `<p style="text-align: center; color: var(--text-muted, #94a3b8); padding: 20px;">No tasks yet. Add one above!</p>`;
        return;
    }

    data.forEach((item) => {
    
        const todoCard = document.createElement("div");
        todoCard.className = "todo-item";

        const textPara = document.createElement("p");
        textPara.textContent = item.title;

        const btnGroup = document.createElement("div");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editTodo(item.id, item.title);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteTodo(item.id);

        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(deleteBtn);

        todoCard.appendChild(textPara);
        todoCard.appendChild(btnGroup);

        todoList.appendChild(todoCard);
    });
}

async function deleteTodo(id) {
    const { error } = await supabaseClient
        .from("todos")
        .delete()
        .eq("id", id);

    if (error) {
        console.log("Error deleting todo:", error);
        return;
    }

    getTodos();
}

async function editTodo(id, oldTitle) {
    const newTitle = prompt("Update Todo", oldTitle);

    
    if (newTitle === null || newTitle.trim() === "") return;

    const { error } = await supabaseClient
        .from("todos")
        .update({
            title: newTitle.trim()
        })
        .eq("id", id);

    if (error) {
        console.log("Error updating todo:", error);
        return;
    }

    getTodos();
}