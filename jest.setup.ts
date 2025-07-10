// jest.setup.js
import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock LayoutAnimation
jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
  ...jest.requireActual('react-native/Libraries/LayoutAnimation/LayoutAnimation'),
  configureNext: jest.fn(),
  easeInEaseOut: jest.fn(),
  spring: jest.fn(),
}));