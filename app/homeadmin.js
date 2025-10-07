import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';  // Importa el hook useNavigation
import Header from '../components/header';

export default function HomeAdmin() {
  const navigation = useNavigation(); // Usa el hook useNavigation para obtener navigation
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserName(user.nombre || '');
          setUserEmail(user.email || '');
          setUserRole(user.role || '');
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    getUserData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header con logo de ancho completo */}
    <Header />

      {/* Usuario */}
      <View style={styles.userContainer}>
        <View style={styles.iconBox}>
          <FontAwesome5 name="user-tie" size={24} color="black" />
        </View>
        <View>
          <Text style={styles.userName}>
            {userName} - {userRole}
          </Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>
      </View>

      <View style={styles.separator} />

      {/* Opciones del menú */}
      {[ 
        { icon: 'dashboard', label: 'Panel del usuarios', onPress: () =>navigation.navigate('usuarios')  },
        { icon: 'library-books', label: 'Tuls', onPress: () => navigation.navigate('editartuls') },  // Aquí la navegación
        { icon: 'gesture', label: 'Movimientos Fundamentales',  onPress: () => navigation.navigate('movimientoadmin')},
        { icon: 'book', label: 'DO (Filosofía)', onPress: () => navigation.navigate('doadmin') },
       { icon: 'edit', label: 'Explicaciones y recomendaciones', onPress: () => navigation.navigate('editarintroduccion') },
        { icon: 'school', label: 'Academia', onPress: () => navigation.navigate('academiaadmin') },
        { icon: 'location-on', label: 'Dojang/ Escuelas', onPress: () =>navigation.navigate('dojanadmin') },
        { icon: 'verified-user', label: 'Usuarios PRO', onPress: () => navigation.navigate('usuariospro') },
      ].map((item, index) => (
        <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
          <MaterialIcons name={item.icon} size={24} color="black" />
          <Text style={styles.menuLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      {/* Botón Salir */}
<TouchableOpacity
  style={styles.logoutButton}
  onPress={async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  }}
>
  <Text style={styles.logoutText}>Salir</Text>
</TouchableOpacity>


      {/* Footer */}
      <Text style={styles.footer}>
        Thinking with <Text style={{ fontWeight: 'bold' }}>Mindcircus Agency.</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  logoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: 100,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userEmail: {
    color: 'gray',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 12,
    color: 'gray',
  },
});
