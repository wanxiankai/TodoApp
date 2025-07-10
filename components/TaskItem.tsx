import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const motiContainerProps = {
    from: { opacity: 0, scale: 0.8, marginBottom: -48 },
    animate: { opacity: 1, scale: 1, marginBottom: 12 },
    exit: {
      opacity: 0,
      scale: 0.8,
      marginBottom: -48,
      height: 0,
    },
    transition: { type: 'timing', duration: 300 },
  };

  return (
    <AnimatePresence>
      <MotiView {...motiContainerProps} style={styles.taskContainer}>
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
              <MotiText from={{ scale: 0 }} animate={{ scale: 1 }} style={styles.checkmark}>
                ✓
              </MotiText>
            )}
          </MotiView>
        </TouchableOpacity>

        <View style={styles.taskTextContainer}>
          <MotiText
            style={styles.taskText}
            animate={{ color: task.completed ? '#9ca3af' : '#1f2937' }}
            transition={{ type: 'timing', duration: 300 }}
          >
            {task.text}
          </MotiText>
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
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  checkboxContainer: { marginRight: 16 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  taskTextContainer: { flex: 1, justifyContent: 'center' },
  taskText: { fontSize: 16, color: '#1f2937' },
  strikethrough: { position: 'absolute', height: 2, backgroundColor: '#9ca3af' },
  deleteButton: { marginLeft: 16, padding: 8 },
  deleteButtonText: { fontSize: 16, color: '#ef4444', fontWeight: 'bold' },
});

export default React.memo(TaskItem);
