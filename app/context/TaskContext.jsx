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
        overdue: false,
        endTime: task.endTime || '00:00',
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
        task.id === id
          ? {
              ...task,
              ...updatedTask,
              alerted: false, // Resetează starea de alertă
            }
          : task
      )
    );
  };

  // Marcăm un task ca finalizat/nefinalizat
  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              alerted: false,
              overdue: false,
            }
          : task
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
      if (task.completed || task.overdue || task.alerted) {
        return false; // Exclude task-urile completate, overdue sau deja alertate
      }

      const taskEndTime = new Date();
      const [hours, minutes] = task.endTime.split(':').map(Number);
      taskEndTime.setHours(hours, minutes, 0, 0);

      const timeDifference = taskEndTime - currentTime;
      return timeDifference > 0 && timeDifference <= 5 * 60 * 1000; // Task-uri care expiră în următoarele 5 minute
    });
  };

  const checkExpiredTasks = () => {
    const currentTime = new Date();

    return tasks.filter((task) => {
      if (task.completed || task.overdue) {
        return false; // Exclude task-urile completate sau deja overdue
      }

      const taskEndTime = new Date();
      const [hours, minutes] = task.endTime.split(':').map(Number);
      taskEndTime.setHours(hours, minutes, 0, 0);

      return taskEndTime < currentTime; // Task-ul este expirat
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
