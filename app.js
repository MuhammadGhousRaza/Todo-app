// Select Elements

const todoInput = document.querySelector("#todoInput");
const addBtn = document.querySelector("#addBtn");
const todoList = document.querySelector("#todoList");



// Add Todo

addBtn.addEventListener("click", async () => {

    const todoText = todoInput.value.trim();


    if (todoText === "") {
        return;
    }


    const { error } = await supabaseClient
        .from("todos")
        .insert([
            {
                todo: todoText
            }
        ]);


    if (error) {

        console.log(error);
        return;

    }


    todoInput.value = "";


    getTodos();

});




// Get Todos
async function getTodos() {

    todoList.innerHTML = "";


    const { data, error } = await supabaseClient
        .from("todos")
        .select("*")
        .order("id", { ascending: false });


    if (error) {
        console.log(error);
        return;
    }



    data.forEach((item) => {


        todoList.innerHTML += `

            <div class="todo-item">

                <p>${item.todo}</p>


                <button onclick="editTodo('${item.id}', '${item.todo}')">
                    Edit
                </button>


                <button onclick="deleteTodo('${item.id}')">
                    Delete
                </button>


            </div>

        `;


    });


}



// Delete Todo

async function deleteTodo(id) {

    console.log("Delete ID:", id);


    const { data, error } = await supabaseClient
        .from("todos")
        .delete()
        .eq("id", id)
        .select();


    console.log(data);
    console.log(error);


    if (error) {
        console.log(error);
        return;
    }


    getTodos();

}
async function editTodo(id, oldTodo) {

    const newTodo = prompt("Update your todo:", oldTodo);


    if (newTodo === null || newTodo.trim() === "") {
        return;
    }


    const { error } = await supabaseClient
        .from("todos")
        .update({
            todo: newTodo
        })
        .eq("id", id);



    if (error) {

        console.log(error);
        return;

    }


    getTodos();

}




// Load Todos when page opens

getTodos();