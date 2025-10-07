import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/header';
import Footer from '../components/footer';

export default function RegisterForm() {
  const navigation = useNavigation();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    if (password !== repeatPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const userData = { nombre, apellido, email, password };

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://taekwondoitfapp.com/api/auth/register-step1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Usuario registrado:', result);
        // Asumiendo que el backend devuelve el username o un id
        const username = result.username || email; // Cambia según lo que retorne tu API
        navigation.navigate('ConfirmRegister', { username }); // Pasamos username al siguiente paso
      } else {
        throw new Error(result.message || 'Error en el registro');
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado');
      console.log('Error de registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Image
          source={require('../assets/images/TaeKwonDo.jpg')}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>Registrate</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          placeholderTextColor="#888"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Tu apellido"
          placeholderTextColor="#888"
          value={apellido}
          onChangeText={setApellido}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Repetir contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          value={repeatPassword}
          onChangeText={setRepeatPassword}
        />

        <TouchableOpacity
          style={styles.registerBtn}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerText}>
            {loading ? 'Cargando...' : 'Continuar registro'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.navigate('LoginScreen')} 
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  // (Tus estilos aquí, iguales que los que ya diste)
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingHorizontal: 20, paddingVertical: 30, alignItems: 'center' },
  image: { width: '100%', height: 200, borderRadius: 6, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 12, fontSize: 16 },
  registerBtn: { backgroundColor: '#000', paddingVertical: 14, borderRadius: 6, width: '100%', alignItems: 'center', marginBottom: 10 },
  registerText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { borderColor: '#000', borderWidth: 1, borderRadius: 6, paddingVertical: 14, width: '100%', alignItems: 'center' },
  cancelText: { color: '#000', fontSize: 16 },
  errorText: { color: 'red', fontSize: 16, marginBottom: 10 },
});
