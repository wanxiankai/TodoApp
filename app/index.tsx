import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AddTaskInput from '../components/AddTaskInput';
import EmptyList from '../components/EmptyList';
import FooterActions from '../components/FooterActions';
import TaskItem from '../components/TaskItem';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { Task, UserStats } from '../types';

export default function TodoAppScreen() {
  const { currentUser, isLoading: authLoading, logout, recordTodoCreated, getUserStats } = useAuth();
  const {
    tasks,
    isLoading: tasksLoading,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  } = useTasks();
  
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace('/auth');
    }
  }, [currentUser, authLoading]);

  useEffect(() => {
    if (currentUser) {
      loadUserStats();
    }
  }, [currentUser]);

  const loadUserStats = async () => {
    if (currentUser) {
      const stats = await getUserStats(currentUser.id);
      setUserStats(stats);
    }
  };

  const handleAddTask = async (text: string) => {
    addTask(text);
    if (currentUser) {
      await recordTodoCreated(currentUser.id);
      loadUserStats(); // Refresh stats
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/auth');
  };

  if (authLoading || tasksLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!currentUser) {
    return null;
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
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Tasks</Text>
          <Text style={styles.welcomeText}>Welcome back, {currentUser.name}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {userStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.sevenDayTodoCreatedCount}</Text>
            <Text style={styles.statLabel}>Tasks Created (7d)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.sevenDayLoginCount}</Text>
            <Text style={styles.statLabel}>Logins (7d)</Text>
          </View>
        </View>
      )}
      
      <AddTaskInput onAddTask={handleAddTask} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
});
