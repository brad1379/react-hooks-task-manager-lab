import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState([]);

    // Initial fetch of the tasks
    useEffect(() => {
        fetch('http://localhost:6001/tasks')
        .then(r=>r.json())
        .then(data=>setTasks(data))
    }, []);

    //  Function to add tasks with a patch method
    function addTask(title){
        fetch('http://localhost:6001/tasks', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, completed: false}),
        })
        .then(r=>r.json())
        .then(newTask => setTasks(prevTasks => [...prevTasks, newTask]))
    }

    // Function to toggle completion of tasks
    function toggleComplete(id, completed) {
        fetch(`http://localhost:6001/tasks/${id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({completed: !completed}),
        })
        .then(r=>r.json())
        .then(updatedTask => 
            setTasks(prevTasks => 
                prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)))
    }

    return (
        <TaskContext.Provider value={{tasks, setTasks, loading, setLoading, addTask, toggleComplete}}>
            {children}
        </TaskContext.Provider>
    )
}
