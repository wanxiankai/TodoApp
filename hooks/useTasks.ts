import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Keyboard, LayoutAnimation } from 'react-native';
import { Task } from '../types';

const STORAGE_KEY = '@todo_app_tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks) as Task[]);
        }
      } catch (e) {
        console.error('Failed to load tasks.', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, []);


  useEffect(() => {
    const saveTasks = async () => {
      try {
        if (!isLoading) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
      } catch (e) {
        console.error('Failed to save tasks.', e);
      }
    };
    saveTasks();
  }, [tasks, isLoading]);

  const withAnimation = (callback: () => void) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    callback();
  };

  const addTask = useCallback((text: string) => {
    if (text.trim() === '') return;
    const newTaskObject: Task = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
    };
    withAnimation(() => {
      setTasks(prevTasks => [newTaskObject, ...prevTasks]);
    });
    Keyboard.dismiss();
  }, []);

  const toggleTask = useCallback((id: string) => {
    withAnimation(() => {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    withAnimation(() => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    });
  }, []);

  const clearCompleted = useCallback(() => {
    withAnimation(() => {
      setTasks(prevTasks => prevTasks.filter(task => !task.completed));
    });
  }, []);

  return {
    tasks,
    isLoading,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  };
};
