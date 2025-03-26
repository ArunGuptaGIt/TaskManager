import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [inputWord, setInputWord] = useState("");
    const [description, setdescription] = useState("");
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);


    const fetchTasks = async () => {
        const res = await axios.get('http://localhost:5000/tasks');
        setTasks(res.data);
    };

    const addTask = async () => {
        if (!inputWord.trim()) return;
        await axios.post('http://localhost:5000/tasks', { task_name: inputWord , task_description: description});
        setInputWord('');
        setdescription('');
        fetchTasks();
    };

    const editTask = async (id, editedTask) => {
        await axios.put(`http://localhost:5000/tasks/${id}`, editedTask);
        fetchTasks();
    };

    const deleteTask = async (id) => {
        await axios.delete(`http://localhost:5000/tasks/${id}`);
        fetchTasks();
    };

    const updateTask = async (id, updatedTask) => {
        await axios.put(`http://localhost:5000/tasks/${id}`, updatedTask);
        fetchTasks();
    };

    return (
        <div className="mainbox">
            <h1>Tasks</h1>
            <div className="listingtasks">
                {tasks.length === 0 ? (
                    <p style={{fontSize : "2rem"}}>No task Available</p>
                ) : (tasks.map((task) => (
                    <div key={task.id} className="singletask">
                        <div className="displaytask">
                            <input
                                className='checkBoxes'
                                checked={task.is_completed}
                                onChange={(e) =>
                                    updateTask(task.id, {
                                        task_name: task.task_name,
                                        task_description: task.task_description,
                                        is_completed: e.target.checked,
                                    })
                                }
                                type="checkbox"
                            />
                            <div className="displaying">
                            
                                <div style={{textDecoration: task.is_completed? "line-through" : "none", 
                                    opacity: task.is_completed ? "0.5" : "1"
                                }} className='tasknames'>{task.task_name ? task.task_name : "No task Available"}</div>
                                
                                <div style={{textDecoration: task.is_completed? "line-through" : "none", 
                                    opacity: task.is_completed ? "0.5" : "1",
                                    fontSize: "1.1rem"
                                }} className='taskdescription'>{task.task_description}</div>
                            </div>
                        </div>
                        <div className="updatedelbutton">
                            <button
                                className='edit btn'
                                onClick={() =>
                                    editTask(task.id, {
                                        task_name: prompt('Edit Taskname:', task.task_name),
                                        task_description:prompt('Edit Description:', task.task_description),
                                        is_completed: task.is_completed,
                                    })
                                }
                            >
                                Edit
                            </button>
                            <button className='delete btn' onClick={() => deleteTask(task.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                )))}
            </div>

            <div className="addtask">
                <div className="typingplace">
                    <input className='typetask title' value={inputWord} onChange={(e) => setInputWord(e.target.value)} type="text" placeholder='Task Title'/>
                    <textarea className='typetask description' value={description} onChange={(e) => setdescription(e.target.value)} type="text" placeholder='Add Description'/>
                </div>
                <button className='clicktoaddtask btn' onClick={addTask}>Add Task</button>
            </div>
        </div>
    );
};

export default App;
