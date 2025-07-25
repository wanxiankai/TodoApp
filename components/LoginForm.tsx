import { router } from 'expo-router';
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

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSwitchToRegister: () => void;
  isLoading?: boolean;
}

export default function LoginForm({ onLogin, onSwitchToRegister, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const result = await onLogin(email.trim(), password);
    setIsSubmitting(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Please try again');
    }else {
      router.replace('/');
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
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
        </View>

        <TouchableOpacity
          style={[styles.button, (isSubmitting || isLoading) && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isSubmitting || isLoading}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={onSwitchToRegister}
          disabled={isSubmitting || isLoading}
        >
          <Text style={styles.switchText}>
            Don&apos;t have an account? <Text style={styles.switchTextBold}>Sign Up</Text>
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