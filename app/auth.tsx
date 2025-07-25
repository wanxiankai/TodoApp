import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../hooks/useAuth';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const { register, login, isLoading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      {isLogin ? (
        <LoginForm
          onLogin={login}
          onSwitchToRegister={() => setIsLogin(false)}
          isLoading={isLoading}
        />
      ) : (
        <RegisterForm
          onRegister={register}
          onSwitchToLogin={() => setIsLogin(true)}
          isLoading={isLoading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});