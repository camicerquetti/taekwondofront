import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/header';

export default function EditUser() {
  const navigation = useNavigation();
  const route = useRoute();

  const userId = route.params?.id;

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState('basico');
  const [selectedRole, setSelectedRole] = useState('estudiante'); // nuevo estado role
  const [expirationDate, setExpirationDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!userId) {
      Alert.alert('Error', 'No se encontró el ID del usuario');
      navigation.goBack();
      return;
    }

    fetch(`http://localhost:5000/api/auth/usuarios/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar usuario');
        return res.json();
      })
      .then((data) => {
        setNombre(data.nombre);
        setApellido(data.apellido);
        setEmail(data.email);
        setSelectedAccountType(data.instructor_mayor || null);
      setSelectedAccountType(data.instructor_mayor || null);
      // Aquí asignamos 'pro' o 'basico' según venga del backend, en minúsculas

              // Aquí asigna suscripción a selectedSubscription
       // Aquí asigna suscripción a selectedSubscription
      setSelectedSubscription(data.suscripcion ? data.suscripcion.toLowerCase() : 'basico');

        setSelectedRole(data.role || 'estudiante'); // asignar role
        setExpirationDate(data.expiracionSuscripcion || '');
      })
      .catch((err) => {
        Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
        console.error(err);
      });
  }, [userId, navigation]);

  const handleSelectAccountType = (type) => {
    setSelectedAccountType(type);
  };

  const handleSelectSubscription = (plan) => {
    setSelectedSubscription(plan);
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const handleGuardarCambios = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!nombre.trim() || !apellido.trim() || !email.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    setIsSaving(true);

    const userData = {
      nombre,
      apellido,
      email,
      instructor_mayor: selectedAccountType,
      plan: selectedSubscription,
      role: selectedRole, // enviar role aparte
      expiracionSuscripcion: expirationDate,
    };

    if (password.trim() !== '') {
      userData.password = password;
    }

    fetch(`http://localhost:5000/api/auth/usuarios/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          const errorMsg = data?.message || 'Error al actualizar usuario';
          throw new Error(errorMsg);
        }
        return data;
      })
      .then(() => {
        Alert.alert('Éxito', 'Usuario actualizado correctamente', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      })
      .catch((err) => {
        Alert.alert('Error', `No se pudo actualizar el usuario: ${err.message}`);
        console.error(err);
      })
      .finally(() => setIsSaving(false));
  };

  const handleEliminarUsuario = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro que quieres eliminar tu usuario? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            fetch(`http://localhost:5000/api/auth/usuarios/${userId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                  const errorMsg = data?.message || 'Error al eliminar usuario';
                  throw new Error(errorMsg);
                }
                return data;
              })
              .then(() => {
                Alert.alert('Usuario eliminado', 'Tu cuenta fue eliminada.', [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Login'),
                  },
                ]);
              })
              .catch((err) => {
                Alert.alert('Error', `No se pudo eliminar el usuario: ${err.message}`);
                console.error(err);
              });
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar usuario</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          value={apellido}
          onChangeText={setApellido}
          placeholder="Apellido"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Nueva contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe nueva contraseña"
          placeholderTextColor="#999"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirma nueva contraseña"
          placeholderTextColor="#999"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Tipo de cuenta</Text>
        <View style={styles.row}>
          {['Instructor mayor', 'Instructor', 'Practicante', 'Tutor'].map((type) => {
            const isSelected = selectedAccountType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.toggleButton,
                  isSelected && styles.toggleButtonActive,
                ]}
                onPress={() => handleSelectAccountType(type)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isSelected && styles.toggleTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Modificar suscripción</Text>
        <View style={styles.subscriptionContainer}>
          {['pro', 'basico'].map((plan) => {
            const isSelected = selectedSubscription === plan;
            return (
              <TouchableOpacity
                key={plan}
                style={[
                  styles.subscriptionButton,
                  isSelected && styles.subscriptionButtonActive,
                ]}
                onPress={() => handleSelectSubscription(plan)}
              >
                <Text
                  style={[
                    styles.subscriptionText,
                    isSelected && styles.subscriptionTextActive,
                  ]}
                >
                  {plan}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Rol de usuario</Text>
        <View style={styles.subscriptionContainer}>
          {['admin', 'estudiante'].map((role) => {
            const isSelected = selectedRole === role;
            return (
              <TouchableOpacity
                key={role}
                style={[
                  styles.subscriptionButton,
                  isSelected && styles.subscriptionButtonActive,
                ]}
                onPress={() => handleSelectRole(role)}
              >
                <Text
                  style={[
                    styles.subscriptionText,
                    isSelected && styles.subscriptionTextActive,
                  ]}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>
          Fecha de expiración (si cuenta con suscripción)
        </Text>
        <TouchableOpacity style={styles.datePicker}>
          <Text style={styles.dateText}>{expirationDate || 'No asignada'}</Text>
          <Feather
            name="calendar"
            size={20}
            color="#333"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleGuardarCambios}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleEliminarUsuario}
        >
          <Text style={styles.deleteButtonText}>Eliminar usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#000',
  },
  toggleText: {
    fontSize: 14,
    color: '#333',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  subscriptionContainer: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  subscriptionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    marginBottom: 8,
    alignItems: 'center',
  },
  subscriptionButtonActive: {
    backgroundColor: '#000',
  },
  subscriptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  subscriptionTextActive: {
    color: '#fff',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#000',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#e63946',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#777',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
