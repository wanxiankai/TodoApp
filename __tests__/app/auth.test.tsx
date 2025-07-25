import { fireEvent, render } from '@testing-library/react-native';
import AuthScreen from '../../app/auth';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    register: jest.fn().mockResolvedValue({ success: true }),
    login: jest.fn().mockResolvedValue({ success: true }),
    isLoading: false,
  }),
}));

describe('AuthScreen', () => {
  it('should render login form by default', () => {
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);
    
    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('should switch to register form', () => {
    const { getByText, getAllByText } = render(<AuthScreen />);
    
    const switchButton = getByText('Sign Up');
    fireEvent.press(switchButton);
    
    expect(getAllByText('Create Account')).toHaveLength(2); // Title and button
  });

  it('should switch back to login form', () => {
    const { getByText, getAllByText } = render(<AuthScreen />);
    
    // Switch to register
    fireEvent.press(getByText('Sign Up'));
    expect(getAllByText('Create Account')).toHaveLength(2);
    
    // Switch back to login
    fireEvent.press(getByText('Sign In'));
    expect(getByText('Welcome Back')).toBeTruthy();
  });
});