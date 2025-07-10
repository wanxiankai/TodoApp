import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatePresence, MotiText, MotiView } from 'moti';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Keyboard,
    LayoutAnimation,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const STORAGE_KEY = '@todo_app_tasks';

// --- TaskItem Component ---
const TaskItem = React.memo(function TaskItem({ task, onToggle, onDelete }) {
  const motiProps = {
    from: { opacity: 0, scale: 0.8, marginBottom: -48 },
    animate: { opacity: 1, scale: 1, marginBottom: 12 },
    exit: {
      opacity: 0,
      scale: 0.8,
      marginBottom: -48,
      height: 0,
    },
    transition: {
      type: 'timing',
      duration: 300,
    },
  };

  return (
    <AnimatePresence>
      <MotiView {...motiProps} style={styles.taskContainer}>
        <TouchableOpacity onPress={() => onToggle(task.id)} style={styles.checkboxContainer}>
          <MotiView
            style={styles.checkbox}
            animate={{
              backgroundColor: task.completed ? '#3b82f6' : '#fff',
              borderColor: task.completed ? '#3b82f6' : '#cbd5e1',
            }}
            transition={{ type: 'timing', duration: 200 }}
          >
            {task.completed && (
              <MotiText
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={styles.checkmark}
              >
                ✓
              </MotiText>
            )}
          </MotiView>
        </TouchableOpacity>

         {/* Task Text and Strikethrough line container */}
        <View style={styles.taskTextContainer}>
          <MotiText
            style={styles.taskText}
            animate={{
              color: task.completed ? '#9ca3af' : '#1f2937',
            }}
            transition={{ type: 'timing', duration: 300 }}
          >
            {task.text}
          </MotiText>
          {/* 问题 2 解决: 添加一个 MotiView 来模拟删除线动画 */}
          <MotiView
            from={{ width: '0%' }}
            animate={{ width: task.completed ? '100%' : '0%' }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.strikethrough}
          />
        </View>

        <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </MotiView>
    </AnimatePresence>
  );
});


// --- Main Screen Component for Expo Router ---
export default function TodoAppScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const inputRef = useRef(null);

  // Load tasks from storage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (e) {
        console.error('Failed to load tasks.', e);
      }
    };
    loadTasks();
  }, []);

  // Save tasks to storage on change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.error('Failed to save tasks.', e);
      }
    };
    saveTasks();
  }, [tasks]);

  const handleAddTask = useCallback(() => {
    if (newTask.trim() === '') return;
    const newTaskObject = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prevTasks => [newTaskObject, ...prevTasks]);
    setNewTask('');
    Keyboard.dismiss();
  }, [newTask]);

  const handleToggleTask = useCallback((id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const handleDeleteTask = useCallback((id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const handleClearCompleted = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor="#9ca3af"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        )}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black" 
        ListEmptyComponent={
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.emptyContainer}
          >
            <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
          </MotiView>
        }
      />

      {tasks.some(t => t.completed) && (
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.footer}
        >
          <TouchableOpacity style={styles.clearButton} onPress={handleClearCompleted}>
            <Text style={styles.clearButtonText}>Clear Completed</Text>
          </TouchableOpacity>
        </MotiView>
      )}
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // slate-50
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b', // slate-800
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0', // slate-200
    height: 50, 
    textAlignVertical: 'center',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#3b82f6', // blue-500
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  taskText: {
    fontSize: 16,
    color: '#1f2937',
  },
   strikethrough: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#9ca3af', 
  },
  deleteButton: {
    marginLeft: 16,
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#ef4444', // red-500
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b', // slate-500
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#f8fafc',
  },
  clearButton: {
    backgroundColor: '#ef4444', // red-500
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});