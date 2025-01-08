import React, { createContext, useState, useContext } from 'react';

// Creează contextul
const TaskContext = createContext();

// Folosește contextul în aplicație
export const useTaskContext = () => useContext(TaskContext);

// Provider-ul contextului
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleCompleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks(tasks.filter((t) => t.id !== taskId));
    setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, task]);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, completedTasks, handleAddTask, handleCompleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};
