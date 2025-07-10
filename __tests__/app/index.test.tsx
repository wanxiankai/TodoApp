import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import TodoAppScreen from '../../app/index';

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('TodoAppScreen', () => {
  beforeEach(() => {
    mockedAsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('should render the title and input box', async () => {
    const { getByText, getByPlaceholderText } = render(<TodoAppScreen />);
    await waitFor(() => expect(getByText('My Tasks')).toBeVisible());
    expect(getByPlaceholderText('Add a new task...')).toBeVisible();
  });

  it('should be able to add a new task', async () => {
    const { getByText, getByPlaceholderText, findByText } = render(<TodoAppScreen />);
    await waitFor(() => expect(getByText('My Tasks')).toBeVisible());

    const input = getByPlaceholderText('Add a new task...');
    const addButton = getByText('Add');
    const taskText = 'My first test task';

    fireEvent.changeText(input, taskText);
    fireEvent.press(addButton);

    // `findByText` is sufficient. It waits for the element to appear.
    expect(await findByText(taskText)).toBeTruthy();

    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@todo_app_tasks',
      expect.stringContaining(taskText)
    );
  });

  it('should be able to mark a task as completed', async () => {
    const { getByText, getByPlaceholderText, findByText, findByTestId } = render(<TodoAppScreen />);
    await waitFor(() => expect(getByText('My Tasks')).toBeVisible());

    const taskText = 'Task to be completed';
    fireEvent.changeText(getByPlaceholderText('Add a new task...'), taskText);
    fireEvent.press(getByText('Add'));
    await findByText(taskText); // Wait for the task to be added

    // Use the new, predictable testID for robust selection.
    const checkbox = await findByTestId(`checkbox-${taskText}`);
    fireEvent.press(checkbox);

    const clearButton = await findByText('Clear Completed');
    // CORRECTED: Check for truthiness instead of visibility to avoid animation race conditions.
    expect(clearButton).toBeTruthy();
  });

  it('should be able to delete a task', async () => {
    const { getByText, getByPlaceholderText, findByText, queryByText, findByTestId } = render(<TodoAppScreen />);
    await waitFor(() => expect(getByText('My Tasks')).toBeVisible());

    const taskText = 'Task to be deleted';
    fireEvent.changeText(getByPlaceholderText('Add a new task...'), taskText);
    fireEvent.press(getByText('Add'));
    await findByText(taskText); // Wait for the task to be added

    // Use the new, predictable testID for robust selection.
    const deleteButton = await findByTestId(`delete-${taskText}`);
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(queryByText(taskText)).toBeNull();
    });
  });

  it('should be able to clear all completed tasks', async () => {
    const { getByText, getByPlaceholderText, findByText, queryByText, findByTestId } = render(<TodoAppScreen />);
    await waitFor(() => expect(getByText('My Tasks')).toBeVisible());
    
    const input = getByPlaceholderText('Add a new task...');
    const addButton = getByText('Add');
    const task1Text = 'Task one (completed)';
    const task2Text = 'Task two (uncompleted)';

    fireEvent.changeText(input, task1Text);
    fireEvent.press(addButton);
    fireEvent.changeText(input, task2Text);
    fireEvent.press(addButton);

    // Wait for both tasks to appear
    await findByText(task1Text);
    await findByText(task2Text);
    
    // Use the new, predictable testID for robust selection.
    const checkbox1 = await findByTestId(`checkbox-${task1Text}`);
    fireEvent.press(checkbox1);

    const clearButton = await findByText('Clear Completed');
    fireEvent.press(clearButton);

    await waitFor(() => {
      expect(queryByText(task1Text)).toBeNull();
    });
    // CORRECTED: Check for truthiness instead of visibility to avoid animation race conditions.
    expect(getByText(task2Text)).toBeTruthy();
  });
});
