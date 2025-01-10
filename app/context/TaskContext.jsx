import React, { createContext, useState } from 'react';

// Crearea contextului
export const TaskContext = createContext();

// Furnizorul de context pentru task-uri
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Funcție pentru a adăuga un task nou
  const addTask = (task) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { ...task, id: Date.now().toString(), completed: false },
    ]);
  };

  // Funcție pentru a șterge un task
  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Funcție pentru a edita un task
  const editTask = (id, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  // Funcție pentru a schimba starea de completare a unui task
  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        editTask,
        toggleTaskCompletion,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
