import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';

export default function ResetPasswordNewPassword({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/TaeKwonDo.jpg')} style={styles.image} />
      <Text style={styles.title}>Reseteá contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresar la nueva contraseña"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Repetir la nueva contraseña"
        secureTextEntry
      />
      <Button title="Confirmar" onPress={() => navigation.navigate('Success')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
