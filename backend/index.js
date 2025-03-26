const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'TaskManagerDB',
    password: '1234',
    port: 5432,
});

client.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database successfully!');
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM tasks ORDER BY is_completed ASC, id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching tasks:', err.message);
        res.status(500).json({ error: 'Could not fetch tasks' });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const { task_name, task_description } = req.body;

        const result = await client.query(
            'INSERT INTO tasks (task_name, task_description) VALUES ($1, $2) RETURNING *',
            [task_name, task_description]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding task:', err.message);
        res.status(500).json({ error: 'Could not add task' });
    }
});
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { task_name, task_description, is_completed } = req.body;

    try {
        const result = await client.query(
            'UPDATE tasks SET task_name = $1, task_description = $2, is_completed = $3 WHERE id = $4 RETURNING *',
            [task_name, task_description, is_completed, id]
        );

        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (err) {
        console.error('Error updating task:', err.message);
        res.status(500).json({ error: 'Could not update task' });
    }
});


app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await client.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err.message);
        res.status(500).json({ error: 'Could not delete task' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
