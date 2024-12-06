document.addEventListener("DOMContentLoaded", async () => {
    await fetchTodos();
});

// Array to store tasks
let tasks = [];

// Fetch tasks from the backend
const fetchTodos = async () => {
    const response = await fetch('http://localhost:3001/todos');
    tasks = await response.json();
    updateTasksList();
    updateStats();
};

// Save task to the backend
const saveTask = async (task) => {
    const response = await fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    return await response.json();
};

// Add a task
const addTask = async () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text) {
        const newTask = { text, completed: false };
        const savedTask = await saveTask(newTask);
        tasks.push(savedTask);
        taskInput.value = "";
        updateTasksList();
        updateStats();
    }
};

// Toggle task completion
const toggleCompleteTask = async (index) => {
    const task = tasks[index];
    task.completed = !task.completed;
    await fetch(`http://localhost:3001/todos/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: task.completed }),
    });
    updateTasksList();
    updateStats();
};

// Delete task
const deleteTask = async (index) => {
    const task = tasks[index];
    await fetch(`http://localhost:3001/todos/${task.id}`, {
        method: 'DELETE',
    });
    tasks.splice(index, 1);
    updateTasksList();
};

// Update UI
const updateTasksList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onClick="toggleCompleteTask(${index})"/>
                    <p>${task.text}</p>
                </div>
                <div class="icons">
                    <i class="fa-solid fa-trash" onClick="deleteTask(${index})"></i>
                </div>
            </div>
        `;
        taskList.appendChild(listItem);
    });
};

// Update stats
const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = (completeTasks / totalTasks) * 100;
    const progressBar = document.getElementById('progress');
    progressBar.style.width = `${progress}%`;

    document.getElementById('numbers').innerText = `${completeTasks} / ${totalTasks}`;
};

document.getElementById('newtask').addEventListener('click', function (e) {
    e.preventDefault();
    addTask();
});
