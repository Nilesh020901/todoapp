let todos = []; // In-memory storage
let currentId = 1; // Counter for unique IDs

// Get all todos
export async function getAllTodo(req, res) {
    res.json(todos);
}

// Create a new todo
export async function createTodo(req, res) {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    const newTodo = { id: currentId++, text, completed: false };
    todos.push(newTodo);
    res.status(201).json(newTodo);
}

// Update a todo
export async function updateTodo(req, res) {
    const { id } = req.params;
    const { text, completed } = req.body;

    const todoIndex = todos.findIndex(todo => todo.id == id);

    if (todoIndex === -1) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    if (text !== undefined) {
        todos[todoIndex].text = text;
    }
    if (completed !== undefined) {
        todos[todoIndex].completed = completed;
    }

    res.json(todos[todoIndex]);
}

// Delete a todo by ID
export async function deleteTodoById(req, res) {
    const { id } = req.params;
    const todoIndex = todos.findIndex(todo => todo.id == id);

    if (todoIndex === -1) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    todos.splice(todoIndex, 1);
    res.status(204).send();
}

// Search todos
export async function searchTodo(req, res) {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Query parameter missing' });
    }

    const filteredTodos = todos.filter(todo =>
        todo.text.toLowerCase().includes(q.toLowerCase())
    );

    res.json(filteredTodos);
}
