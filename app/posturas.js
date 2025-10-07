import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator,
  Modal, TextInput, ScrollView, Dimensions, Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Detectar si estamos en web
const isWeb = Platform.OS === 'web';

const { height: screenHeight } = Dimensions.get('window');

// Función para formatear 'YYYY-MM-DD' a 'DD/MM/YYYY'
const formatFecha = (fechaIso) => {
  if (!fechaIso) return '';
  const partes = fechaIso.split('T')[0].split('-');
  if (partes.length !== 3) return fechaIso;
  const [year, month, day] = partes;
  return `${day}/${month}/${year}`;
};

const PosturasScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tulId, tulNombre } = route.params;

  const usuarioLogueado = { id: 1, nombre: 'Usuario Demo' };

  const [posturas, setPosturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    interlocutor: '',
    fecha: '',
    lugar: '',
    nota: '',
  });
  const [notas, setNotas] = useState([]);
  const [loadingNotas, setLoadingNotas] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Estado para saber si estamos editando y qué nota
  const [editingNotaId, setEditingNotaId] = useState(null);
const [movimientosTul, setMovimientosTul] = useState('');

  useEffect(() => {
  if (!tulId) return;

  fetch(`https://taekwondoitfapp.com/api/auth/tules/${tulId}`)
    .then(res => res.json())
    .then(data => {
      setMovimientosTul(data.movimientos?.toString() || '');
    })
    .catch(error => {
      console.error('Error cargando movimientos del tul:', error);
    });
}, [tulId]);

  useEffect(() => {
    setLoading(true);
    fetch(`https://taekwondoitfapp.com/api/auth/posturas/${tulId}`)
      .then(res => res.json())
      .then(data => {
        setPosturas(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert('No se pudieron cargar las posturas');
      });
  }, [tulId]);

  useEffect(() => {
    if (posturas.length > 0) {
      cargarNotas(posturas[currentIndex].id);
    }
  }, [currentIndex, posturas]);

  const cargarNotas = (posturaId) => {
    setLoadingNotas(true);
    fetch(`https://taekwondoitfapp.com/api/auth/notas/${posturaId}/${usuarioLogueado.id}`)
      .then(res => res.json())
      .then(data => {
        setNotas(data);
        setLoadingNotas(false);
      })
      .catch(() => {
        setNotas([]);
        setLoadingNotas(false);
      });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Guardar o editar nota según editingNotaId
  const handleSave = async () => {
    if (!formData.nota.trim()) {
      alert('La nota no puede estar vacía');
      return;
    }

    const posturaActual = posturas[currentIndex];

    try {
      let res;
      if (editingNotaId) {
        // Editar nota (PUT)
        res = await fetch(`https://taekwondoitfapp.com/api/auth/notas/${editingNotaId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interlocutor: formData.interlocutor,
            fecha: formData.fecha,
            lugar: formData.lugar,
            nota: formData.nota,
            posturaId: posturaActual.id,
            tipo: formData.tipo || null,
          }),
        });
      } else {
        // Crear nota (POST)
        res = await fetch('https://taekwondoitfapp.com/api/auth/notas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interlocutor: formData.interlocutor,
            fecha: formData.fecha,
            lugar: formData.lugar,
            nota: formData.nota,
            posturaId: posturaActual.id,
            tulId: tulId,
            userId: usuarioLogueado.id,
          }),
        });
      }

      if (!res.ok) throw new Error('Error al guardar la nota');

      setFormData({ interlocutor: '', fecha: '', lugar: '', nota: '' });
      setSelectedDate(null);
      setModalVisible(false);
      setEditingNotaId(null);
      cargarNotas(posturaActual.id);

    } catch (error) {
      alert('No se pudo guardar la nota. Intenta nuevamente.');
    }
  };

  // Abrir modal con nota para editar
  const handleEditNota = (nota) => {
    setEditingNotaId(nota.id);
    setFormData({
      interlocutor: nota.interlocutor || '',
      fecha: nota.fecha || '',
      lugar: nota.lugar || '',
      nota: nota.nota || '',
      tipo: nota.tipo || null,
    });
    setSelectedDate(nota.fecha ? new Date(nota.fecha) : null);
    setModalVisible(true);
  };

  // Eliminar nota con confirmación
  const handleDeleteNota = (id) => {
    if (!confirm('¿Estás seguro que quieres eliminar esta nota?')) return;

    fetch(`https://taekwondoitfapp.com/api/auth/notas/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar');
        cargarNotas(posturas[currentIndex].id);
      })
      .catch(() => alert('No se pudo eliminar la nota.'));
  };

 const handleNext = () => {
  if (currentIndex < posturas.length - 1) {
    setCurrentIndex(currentIndex + 1);
  } else {
    // Si está en la última, vuelve a la primera
    setCurrentIndex(0);
  }
};

const handlePrevious = () => {
  if (currentIndex > 0) {
    setCurrentIndex(currentIndex - 1);
  } else {
    setCurrentIndex(posturas.length - 1); // Si estás en el primero, vuelve al último
  }
};

  const onChangeDateMobile = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const fechaFormateada = `${year}-${month}-${day}`;
      handleChange('fecha', fechaFormateada);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 100 }} />;
  }

  const postura = posturas[currentIndex];

  return (
    
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Text style={styles.backArrow}>←</Text>
  </TouchableOpacity>

  <Text style={styles.headerTitle} numberOfLines={1}>Seleccionar Tul</Text>

  <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
    <Text style={styles.menuIcon}>☰</Text>
  </TouchableOpacity>
</View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'left', padding: 20 }}>
        <View style={styles.titleRow}>
          <Text style={styles.tulNombre} numberOfLines={1} ellipsizeMode="tail">
            {tulNombre}
          </Text>
<View style={styles.posturaContainer}>
  <Text style={styles.posturaNombre} numberOfLines={1} ellipsizeMode="tail">
    {(currentIndex === 0 || currentIndex === posturas.length - 1)
      ? postura.nombre
      : `${currentIndex}/${posturas.length - 2}`}
  </Text>
</View>





          <View style={styles.image2Row}>
            {postura.imagen2 ? (
              <Image
                source={{ uri: `https://taekwondoitfapp.com/uploads/${postura.imagen2}` }}
                style={styles.image2}
              />
            ) : (
              <View style={styles.image2Placeholder} />
            )}

            <TouchableOpacity onPress={() => {
              setModalVisible(true);
              setEditingNotaId(null);
              setFormData({ interlocutor: '', fecha: '', lugar: '', nota: '' });
              setSelectedDate(null);
            }} style={styles.commentButton}>
               <Image 
    source={require('../assets/images/Group 13.png')} // Ruta de tu imagen de lápiz
    style={styles.commentIcon}
  />
            </TouchableOpacity>
          </View>
        </View>

        <Image
          source={{ uri: `https://taekwondoitfapp.com/uploads/${postura.imagen}` }}
          style={[styles.image, { height: screenHeight * 0.55 }]}
        />

     <View style={styles.navBar}>
  <TouchableOpacity onPress={handlePrevious}  style={styles.navItem}>
    <Text style={[styles.arrow, currentIndex === 0 && styles.disabledArrow]}>‹</Text>
    <Text style={[styles.navText, currentIndex === 0 && styles.disabledText]}>Volver</Text>
  </TouchableOpacity>

  <View style={styles.divider} />

  <TouchableOpacity onPress={handleNext}  style={styles.navItem}>
    <Text style={[styles.navText, currentIndex === posturas.length - 1 && styles.disabledText]}>Siguiente</Text>
    <Text style={[styles.arrow, currentIndex === posturas.length - 1 && styles.disabledArrow]}>›</Text>
  </TouchableOpacity>
</View>

{currentIndex === 0 && (
  <Text style={styles.totalMovimientos}>
  Movimientos: {movimientosTul}
</Text>

)}
{/* Descripción debajo de los botones */}

{/* Descripción debajo de los botones */}
<Text style={[styles.descripcion, { textAlign: 'left' }]}>
  {postura.descripcion || 'Sin descripción disponible.'}
</Text>
     
        <View style={{ width: '100%', marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Notas:</Text>
          {loadingNotas ? (
            <ActivityIndicator />
          ) : notas.length === 0 ? (
            <Text style={{ fontStyle: 'italic', color: '#888' }}>No hay notas para esta postura.</Text>
          ) : (
            notas.map((nota) => (
              <View key={nota.id} style={styles.notaContainer}>
                <Text style={styles.notaInterlocutor}>Interlocutor: {nota.interlocutor || 'N/A'}</Text>
                <Text>Fecha: {nota.fecha ? formatFecha(nota.fecha) : 'N/A'}</Text>
                <Text>Lugar: {nota.lugar || 'N/A'}</Text>
                <Text style={styles.notaTexto}>{nota.nota}</Text>

                {/* Botones Editar y Eliminar */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={() => handleEditNota(nota)}
                    style={{
                      backgroundColor: 'black',
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteNota(nota.id)}
                    style={{
                      backgroundColor: 'black',
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {editingNotaId ? 'Editar nota de: ' : 'Agregar una nota a: '} {postura.nombre}
          </Text>

          <Text style={styles.label}>Interlocutor/a:</Text>
          <TextInput
            style={styles.input}
            placeholder="Interlocutor/a"
            value={formData.interlocutor}
            onChangeText={(text) => handleChange('interlocutor', text)}
          />

          <Text style={styles.label}>Fecha:</Text>
          {isWeb ? (
            <input
              type="date"
              style={{
                padding: 10,
                fontSize: 16,
                borderColor: '#ddd',
                borderWidth: 1,
                borderRadius: 6,
                width: '100%',
                boxSizing: 'border-box',
              }}
              value={formData.fecha}
              onChange={(e) => handleChange('fecha', e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
            />
          ) : (
            <>
              <TouchableOpacity
                style={[styles.input, { justifyContent: 'center' }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: formData.fecha ? '#000' : '#888' }}>
                  {formData.fecha ? formatFecha(formData.fecha) : 'Selecciona una fecha'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeDateMobile}
                  maximumDate={new Date()}
                />
              )}
            </>
          )}

          <Text style={styles.label}>Lugar:</Text>
          <TextInput
            style={styles.input}
            placeholder="Lugar"
            value={formData.lugar}
            onChangeText={(text) => handleChange('lugar', text)}
          />

          <Text style={styles.label}>Nota:</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Nota"
            multiline
            value={formData.nota}
            onChangeText={(text) => handleChange('nota', text)}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {editingNotaId ? 'Guardar cambios' : 'Guardar nota'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              setEditingNotaId(null);
              setFormData({ interlocutor: '', fecha: '', lugar: '', nota: '' });
              setSelectedDate(null);
            }}
            style={{ marginTop: 20 }}
          >
            <Text style={{ textAlign: 'center', color: 'gray' }}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titleRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 10, },
  tulNombre: { flexShrink: 1, fontSize: 24, fontWeight: 'bold', color: '#000' },
  posturaContainer: { flex: 3, alignItems: 'left', justifyContent: 'center',padding:7},
  posturaNombre: { fontSize: 18, fontWeight: '500' },
  image2Row: { flexDirection: 'row', alignItems: 'center' },
  image2: { width: 40, height: 40, marginLeft: 10 },
  image2Placeholder: { width: 40, height: 40, backgroundColor: '#eee', marginLeft: 10 },
  commentButton: { marginLeft: 10 },
  commentIcon: { fontSize: 18 },
  image: {
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  nav: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 10 },
  navButton: { fontSize: 16, color: '#000' },
  disabled: { color: '#ccc' },
  counter: { marginVertical: 10 },
  subtitle: { fontSize: 16, textAlign: 'center' },
  pies: { fontSize: 14, color: 'gray', marginTop: 10 },

  notaContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  notaInterlocutor: { fontWeight: 'bold' },
  notaTexto: { marginTop: 5 },

  modalContainer: { padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { marginTop: 10, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginTop: 5,
    borderRadius: 6,
    fontSize: 16,
  },
  
  saveButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 6,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},

backArrow: {
  fontSize: 22,
  color: '#000',
},

headerTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  flex: 1,
  textAlign: 'left',
  color: '#000',

},

menuButton: {
  backgroundColor: '#000',
  borderRadius: 18,
  padding: 8,
  textAlign: 'center',
},

menuIcon: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
navBar: {
  flexDirection: 'row',
  justifyContent: 'space-between', // distribuye los botones a los extremos
  alignItems: 'center',
  width: '100%',
  paddingHorizontal: 20,
  paddingVertical: 10,
  backgroundColor: '#fff', // opcional
},

navItem: {
  flex: 1,                  // que cada botón ocupe el mismo ancho
  alignItems: 'center',     // centra el contenido dentro del botón
  flexDirection: 'row',     // para que el texto y la flecha estén en línea
  justifyContent: 'center', // centra el contenido horizontalmente
},


navText: {
  fontSize: 16,
  fontWeight: '500',
  color: '#000',
},

arrow: {
  fontSize: 18,
  marginHorizontal: 4,
  color: '#000',
},

divider: {
  width: 1,
  height: 20,
  backgroundColor: '#ccc',
  marginHorizontal: 8,
},

disabledText: {
  color: '#ccc',
},

disabledArrow: {
  color: '#101010ff',
},
totalMovimientos: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#000',
  marginVertical: 10,
  textAlign: 'left',   // <-- alineado a la izquierda
},

descripcion: {
  fontSize: 15,
  color: '#444',
  marginTop: 15,
  paddingHorizontal: 0, // opcional, para que no tenga padding lateral
  textAlign: 'left',    // <-- alineado a la izquierda
},





});

export default PosturasScreen;
