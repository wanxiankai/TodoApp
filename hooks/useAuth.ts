import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { User, UserStats } from '../types';

const USERS_STORAGE_KEY = '@todo_app_users';
const CURRENT_USER_KEY = '@todo_app_current_user';
const USER_STATS_KEY = '@todo_app_user_stats';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load current user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCurrentUser();
  }, []);

  const register = useCallback(async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Get existing users
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: Array<User & { password: string }> = usersData ? JSON.parse(usersData) : [];
      
      // Check if user already exists
      if (users.find(user => user.email === email)) {
        return { success: false, error: 'User already exists' };
      }

      // Create new user
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        email,
        name,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Set as current user
      const userWithoutPassword: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
      };
      
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      setCurrentUser(userWithoutPassword);

      // Initialize user stats
      await initializeUserStats(newUser.id);
      await recordLogin(newUser.id);

      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Registration failed' };
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: Array<User & { password: string }> = usersData ? JSON.parse(usersData) : [];
      
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }

      const userWithoutPassword: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      };

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      setCurrentUser(userWithoutPassword);

      // Record login
      await recordLogin(user.id);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const initializeUserStats = async (userId: string) => {
    try {
      const statsData = await AsyncStorage.getItem(USER_STATS_KEY);
      const allStats: UserStats[] = statsData ? JSON.parse(statsData) : [];
      
      if (!allStats.find(stat => stat.userId === userId)) {
        const newStats: UserStats = {
          userId,
          sevenDayTodoCreatedCount: 0,
          sevenDayLoginCount: 0,
          lastUpdated: new Date().toISOString(),
        };
        allStats.push(newStats);
        await AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(allStats));
      }
    } catch (error) {
      console.error('Failed to initialize user stats:', error);
    }
  };

  const cleanupOldStats = async (userId: string) => {
    try {
      const statsData = await AsyncStorage.getItem(USER_STATS_KEY);
      const allStats: UserStats[] = statsData ? JSON.parse(statsData) : [];
      
      const userStatsIndex = allStats.findIndex(stat => stat.userId === userId);
      if (userStatsIndex !== -1) {
        const lastUpdated = new Date(allStats[userStatsIndex].lastUpdated);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        if (lastUpdated < sevenDaysAgo) {
          allStats[userStatsIndex].sevenDayLoginCount = 0;
          allStats[userStatsIndex].sevenDayTodoCreatedCount = 0;
        }
        
        await AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(allStats));
      }
    } catch (error) {
      console.error('Failed to cleanup old stats:', error);
    }
  };

  const recordLogin = async (userId: string) => {
    try {
      await cleanupOldStats(userId);
      
      const statsData = await AsyncStorage.getItem(USER_STATS_KEY);
      const allStats: UserStats[] = statsData ? JSON.parse(statsData) : [];
      
      const userStatsIndex = allStats.findIndex(stat => stat.userId === userId);
      if (userStatsIndex !== -1) {
        allStats[userStatsIndex].sevenDayLoginCount += 1;
        allStats[userStatsIndex].lastUpdated = new Date().toISOString();
        await AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(allStats));
      }
    } catch (error) {
      console.error('Failed to record login:', error);
    }
  };

  const recordTodoCreated = async (userId: string) => {
    try {
      const statsData = await AsyncStorage.getItem(USER_STATS_KEY);
      const allStats: UserStats[] = statsData ? JSON.parse(statsData) : [];
      
      const userStatsIndex = allStats.findIndex(stat => stat.userId === userId);
      if (userStatsIndex !== -1) {
        allStats[userStatsIndex].sevenDayTodoCreatedCount += 1;
        allStats[userStatsIndex].lastUpdated = new Date().toISOString();
        await AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(allStats));
      }
    } catch (error) {
      console.error('Failed to record todo created:', error);
    }
  };

  const getUserStats = async (userId: string): Promise<UserStats | null> => {
    try {
      const statsData = await AsyncStorage.getItem(USER_STATS_KEY);
      const allStats: UserStats[] = statsData ? JSON.parse(statsData) : [];
      return allStats.find(stat => stat.userId === userId) || null;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return null;
    }
  };

  return {
    currentUser,
    isLoading,
    register,
    login,
    logout,
    recordTodoCreated,
    getUserStats,
  };
};