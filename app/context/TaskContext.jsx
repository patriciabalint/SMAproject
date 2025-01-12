import React, { createContext, useState } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Adăugăm un task nou
  const addTask = (task) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        ...task,
        id: Date.now().toString(),
        completed: false,
        alerted: false,
        endTime: task.endTime || '00:00', // Valoare default pentru endTime
      },
    ]);
  };

  // Ștergem un task
  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Edităm un task
  const editTask = (id, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  // Marcăm un task ca finalizat/nefinalizat
  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const markOverdueTasks = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        const taskEndTime = new Date();
        const [hours, minutes] = task.endTime.split(':').map(Number);
        taskEndTime.setHours(hours, minutes, 0);

        const currentTime = new Date();
        if (taskEndTime < currentTime && !task.completed && !task.overdue) {
          return { ...task, overdue: true }; // Marchează task-ul ca "Overdue"
        }
        return task;
      })
    );
  };

  const checkUpcomingTasks = () => {
    const currentTime = new Date();

    return tasks.filter((task) => {
      if (!task.endTime) return false; // Verificăm dacă există o valoare pentru `endTime`

      const taskEndTime = new Date();
      const [hours, minutes] = task.endTime.split(':').map(Number);
      taskEndTime.setHours(hours, minutes, 0, 0); // Setăm orele și minutele

      const timeDifference = taskEndTime - currentTime; // Diferența de timp
      return timeDifference > 0 && timeDifference <= 5 * 60 * 1000; // Task-uri care se termină în următoarele 5 minute
    });
  };

  const checkExpiredTasks = () => {
    const currentTime = new Date();

    return tasks.filter((task) => {
      const taskEndTime = new Date();
      const [hours, minutes] = task.endTime.split(':').map(Number);
      taskEndTime.setHours(hours, minutes, 0);

      return taskEndTime < currentTime && !task.completed && !task.overdue; // Task expirat
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        editTask,
        toggleTaskCompletion,
        checkUpcomingTasks,
        checkExpiredTasks,
        markOverdueTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;
