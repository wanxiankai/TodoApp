import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddTaskInputProps {
  onAddTask: (text: string) => void;
}

const AddTaskInput: React.FC<AddTaskInputProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');

  const handlePress = () => {
    onAddTask(text);
    setText('');
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Add a new task..."
        placeholderTextColor="#9ca3af"
        value={text}
        onChangeText={setText}
        onSubmitEditing={handlePress}
        returnKeyType="done"
      />
      <TouchableOpacity style={styles.addButton} onPress={handlePress}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderColor: '#e2e8f0',
    height: 50,
    textAlignVertical: 'center',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#3b82f6',
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
});

export default AddTaskInput;
