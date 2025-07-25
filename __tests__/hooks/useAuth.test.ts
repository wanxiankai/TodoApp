import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-native';
import { useAuth } from '../../hooks/useAuth';

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('useAuth', () => {
  beforeEach(() => {
    mockedAsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    mockedAsyncStorage.setItem.mockResolvedValue();

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const response = await result.current.register('test@example.com', 'password123', 'Test User');
      expect(response.success).toBe(true);
    });

    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@todo_app_users',
      expect.stringContaining('test@example.com')
    );
  });

  it('should not register user with existing email', async () => {
    const existingUsers = [{
      id: '1',
      email: 'test@example.com',
      name: 'Existing User',
      password: 'password123',
      createdAt: '2024-01-01T00:00:00.000Z',
    }];
    
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingUsers));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const response = await result.current.register('test@example.com', 'password123', 'Test User');
      expect(response.success).toBe(false);
      expect(response.error).toBe('User already exists');
    });
  });

  it('should login with valid credentials', async () => {
    const users = [{
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      createdAt: '2024-01-01T00:00:00.000Z',
    }];
    
    mockedAsyncStorage.getItem.mockImplementation((key) => {
      if (key === '@todo_app_users') {
        return Promise.resolve(JSON.stringify(users));
      }
      return Promise.resolve(null);
    });
    mockedAsyncStorage.setItem.mockResolvedValue();

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const response = await result.current.login('test@example.com', 'password123');
      expect(response.success).toBe(true);
    });

    expect(result.current.currentUser).toEqual({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: '2024-01-01T00:00:00.000Z',
    });
  });

  it('should not login with invalid credentials', async () => {
    const users = [{
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      createdAt: '2024-01-01T00:00:00.000Z',
    }];
    
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(users));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const response = await result.current.login('test@example.com', 'wrongpassword');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Invalid credentials');
    });
  });

  it('should logout user', async () => {
    mockedAsyncStorage.removeItem.mockResolvedValue();

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('@todo_app_current_user');
    expect(result.current.currentUser).toBeNull();
  });
});