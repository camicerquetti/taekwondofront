import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Header from '../components/header';
import { useNavigation, useFocusEffect } from '@react-navigation/native';



const { width } = Dimensions.get('window');

export default function Usuarios() {
  const navigation = useNavigation();
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('A-Z');
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [busqueda, setBusqueda] = useState('');
    useFocusEffect(
    React.useCallback(() => {
      // Función para cargar usuarios
      const cargarUsuarios = () => {
        axios
          .get('https://taekwondoitfapp.com/api/auth/usuarios')
          .then(res => setUsuarios(res.data))
          .catch(err => console.error(err));
      };

      cargarUsuarios();

      // No hace falta cleanup en este caso
      return () => {};
    }, [])
  );

  useEffect(() => {
    axios
      .get('https://taekwondoitfapp.com/api/auth/usuarios')
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error(err));
  }, []);
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '-';
  const fecha = new Date(fechaISO);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan en 0
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

  const usuariosFiltrados = usuarios
    .filter((u) =>
      `${u.nombre} ${u.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      let campoA = '';
      let campoB = '';

      if (filtro === 'A-Z') {
        campoA = a.nombre?.toLowerCase() || '';
        campoB = b.nombre?.toLowerCase() || '';
      } else if (filtro === 'Tipo') {
        campoA = a.plan?.toLowerCase() || '';
        campoB = b.plan?.toLowerCase() || '';
      }

      if (campoA < campoB) return ordenAscendente ? -1 : 1;
      if (campoA > campoB) return ordenAscendente ? 1 : -1;
      return 0;
    });

  const exportarUsuarios = async () => {
    try {
      const encabezado = [
        'ID', 'Nombre', 'Apellido', 'Email', 'Rol', 'Plan',
        'Fecha Registro', 'Estado', 'País', 'Grado', 'Instructor Mayor', 'Graduación', 'instructor', 'dojan', 'escuela',

      ];

      const filas = usuariosFiltrados.map((u) => [
        u.id,
        u.nombre,
        u.apellido,
        u.email,
        u.role,
        u.plan,
         formatearFecha(u.fecha_registro), // ← coma agregada aquí ✅
        u.estado,
        u.pais,
        u.grado,
        u.instructor_mayor ?? '',
        u.graduacion,
         u.instructor ?? '',
      u.dojan ?? '',
      u.escuela ?? '',
      ]);
console.log('Filas CSV:', filas);

      const csvArray = [encabezado, ...filas];
      const csvString = csvArray
        .map((row) =>
          row
            .map((cell) => {
              const text = cell?.toString().replace(/"/g, '""') ?? '';
              return /,|\n/.test(text) ? `"${text}"` : text;
            })
            .join(',')
        )
        .join('\n');

      const nombreArchivo = `usuarios_export_${Date.now()}.csv`;

      if (Platform.OS === 'web') {
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        Alert.alert('Éxito', 'Archivo descargado correctamente.');
      } else {
        const uriLocal = FileSystem.documentDirectory + nombreArchivo;
        await FileSystem.writeAsStringAsync(uriLocal, csvString, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uriLocal, {
            mimeType: 'text/csv',
            dialogTitle: 'Exportar lista de usuarios',
            UTI: Platform.OS === 'ios' ? 'public.comma-separated-values-text' : undefined,
          });
        } else {
          Alert.alert('Descarga completa', `Archivo guardado en:\n${uriLocal}`);
        }
      }
    } catch (error) {
      console.error('Error al exportar usuarios:', error);
      Alert.alert('Error', 'No se pudo generar o compartir el CSV.');
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <TouchableOpacity
  style={styles.dashboardBtn}
  onPress={() => navigation.navigate('homeadmin')}
>
  <Feather name="home" size={20} color="#000" /> {/* Icono casita negro */}
  <Text style={styles.dashboardText}>Dashboard</Text>
</TouchableOpacity>


      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar usuario..."
          value={busqueda}
          onChangeText={setBusqueda}
          style={styles.searchInput}
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.title}>Usuarios</Text>

      <View style={styles.ordenadoContainer}>
        <Text style={styles.ordenadoLabel}>Ordenado por:</Text>

        <TouchableOpacity
          style={[styles.filtroBtn, filtro === 'A-Z' && styles.filtroActivo]}
          onPress={() => {
            setFiltro('A-Z');
            setOrdenAscendente((prev) => filtro === 'A-Z' ? !prev : true);
          }}
        >
          <Text style={[styles.filtroText, filtro === 'A-Z' && styles.filtroTextActivo]}>
            A-Z {filtro === 'A-Z' && (ordenAscendente ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filtroBtn, filtro === 'Tipo' && styles.filtroActivo]}
          onPress={() => {
            setFiltro('Tipo');
            setOrdenAscendente((prev) => filtro === 'Tipo' ? !prev : true);
          }}
        >
          <Text style={[styles.filtroText, filtro === 'Tipo' && styles.filtroTextActivo]}>
            Tipo {filtro === 'Tipo' && (ordenAscendente ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tablaHeader}>
        <Text style={[styles.th, { width: '20%' }]}>Nombre</Text>
        <Text style={[styles.th, { width: '20%' }]}>Apellido</Text>
        <Text style={[styles.th, { width: '20%' }]}>Tipo</Text>
        <Text style={[styles.th, { width: '25%' }]}>Registro</Text>
        <Text style={[styles.th, { width: '15%' }]}>Acción</Text>
      </View>

      <FlatList
        data={usuariosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <View style={styles.tablaFila}>
            <Text style={[styles.td, { width: '20%' }]}>{item.nombre}</Text>
            <Text style={[styles.td, { width: '20%' }]}>{item.apellido}</Text>
            <Text style={[styles.td, { width: '20%' }]}>{item.plan || 'basico'}</Text>
          <Text style={[styles.td, { width: '25%' }]}>
  {formatearFecha(item.fecha_registro)}
</Text>

            <TouchableOpacity
              style={[styles.accionBtn, { width: '15%' }]}
              onPress={() => navigation.navigate('edituser', { id: item.id })}
            >
              <Feather name="check-square" size={16} color="green" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay usuarios para mostrar</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.exportarBtn} onPress={exportarUsuarios}>
        <Text style={styles.exportarText}>Exportar lista de usuarios</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Thinking with Mindcircus Agency.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  dashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 12,
  },
  dashboardText: { marginLeft: 8, fontWeight: 'bold', fontSize: 14 },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 8,
    height: 42,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: '100%', fontSize: 14, color: '#000' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, alignSelf: 'center' },
  ordenadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  ordenadoLabel: { fontSize: 14, fontWeight: '600', marginRight: 8, color: '#333' },
  filtroBtn: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginHorizontal: 6,
  },
  filtroActivo: { backgroundColor: '#000' },
  filtroText: { fontSize: 14, fontWeight: '600', color: '#000' },
  filtroTextActivo: { color: '#fff' },
  tablaHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  th: { fontWeight: 'bold', fontSize: 13, color: '#333' },
  tablaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  td: { fontSize: 13, color: '#555' },
  accionBtn: { alignItems: 'center' },
  emptyContainer: { paddingVertical: 30, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#888' },
  exportarBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
    marginHorizontal: 50,
  },
  exportarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  footer: { marginBottom: 12, textAlign: 'center', fontSize: 12, color: '#888' },
});
