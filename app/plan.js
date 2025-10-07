import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Picker, ScrollView } from 'react-native';
import Header from '../components/header'; // Asegúrate de que exportas default
import Footer from '../components/footer'; // Si también tienes Footer
import { useNavigation } from '@react-navigation/native';
const PlanScreen = () => {
  const [currentPlan, setCurrentPlan] = useState('Basico');
  const [newPlan, setNewPlan] = useState('Pro');
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Mi plan</Text>
        <TextInput
          style={[styles.input, styles.readOnly]}
          value={currentPlan}
          editable={false}
        />

        <Text style={styles.label}>Cambiar plan</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={newPlan}
            onValueChange={(itemValue) => setNewPlan(itemValue)}
          >
            <Picker.Item label="Pro" value="Pro" />
            <Picker.Item label="Basico" value="Basico" />
          </Picker>
        </View>

        <Text style={styles.description}>
          Suscribite y mira todos los contenidos por $9.99 al año.
        </Text>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>

         <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.backButtonText}>Volver</Text>
    </TouchableOpacity>
      </ScrollView>

      <Footer />
    </View>
  );
};

export default PlanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#00cc66',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#00cc66',
    backgroundColor: '#f4f4f4',
  },
  readOnly: {
    backgroundColor: '#f4f4f4',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 20,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
  },
});
