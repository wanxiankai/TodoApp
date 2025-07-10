import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AddTaskInput from '../components/AddTaskInput';
import EmptyList from '../components/EmptyList';
import FooterActions from '../components/FooterActions';
import TaskItem from '../components/TaskItem';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';

export default function TodoAppScreen() {
  const {
    tasks,
    isLoading,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  } = useTasks();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const hasCompletedTasks = tasks.some(t => t.completed);

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={toggleTask}
      onDelete={deleteTask}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>
      <AddTaskInput onAddTask={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: hasCompletedTasks ? 100 : 20 }}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        ListEmptyComponent={<EmptyList />}
      />
      {hasCompletedTasks && <FooterActions onClear={clearCompleted} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
});
