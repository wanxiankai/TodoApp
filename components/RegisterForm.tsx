import { MotiView } from 'moti';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface RegisterFormProps {
  onRegister: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
}

export default function RegisterForm({ onRegister, onSwitchToLogin, isLoading }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !name.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    const result = await onRegister(email.trim(), password, name.trim());
    setIsSubmitting(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.error || 'Please try again');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600 }}
        style={styles.formContainer}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!isSubmitting && !isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting && !isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!isSubmitting && !isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!isSubmitting && !isLoading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, (isSubmitting || isLoading) && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isSubmitting || isLoading}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={onSwitchToLogin}
          disabled={isSubmitting || isLoading}
        >
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.switchTextBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </MotiView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'android' ? 0 : 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: Platform.OS === 'android' ? 18 : undefined,
    height: Platform.OS === 'android' ? 48 : undefined,
    minHeight: 48,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#64748b',
  },
  switchTextBold: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});