import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Image, ActivityIndicator, Alert, Platform, StyleSheet
} from 'react-native';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function EditarTeoriaScreen() {
  const route = useRoute();
  const { id: idTul } = route.params;
const navigation = useNavigation();

  const [teoriaId, setTeoriaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(null);

  const [teoria, setTeoria] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'PRO',
    id_tul: idTul,
  });

  const [secciones, setSecciones] = useState([
    { id: null, titulo: '', descripcion: '', video: '', imagen: null, imagenOriginal: null },
  ]);

  const fileInputsRefs = useRef([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://taekwondoitfapp.com/api/auth/informacion/${idTul}`);
        const { teorias, secciones: dataSec } = res.data;
        if (teorias?.length) {
          const t = teorias[0];
          setTeoria({ titulo: t.titulo, descripcion: t.descripcion, tipo: t.tipo, id_tul: t.id_tul });
          setTeoriaId(t.id);
          const arr = dataSec.map(sec => ({
            id: sec.id,
            titulo: sec.titulo,
            descripcion: sec.descripcion,
            video: sec.video,
            imagen: sec.imagen ? { uri: `https://taekwondoitfapp.com/uploads/${sec.imagen}?t=${imageTimestamp}` } : null,
            imagenOriginal: sec.imagen || null,
          }));
          setSecciones(arr.length ? arr : secciones);
        }
      } catch (e) {
        console.error(e);
        Alert.alert('Error al cargar información');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [idTul, imageTimestamp]);

  const handleChange = (i, f, v) => {
    const copy = [...secciones];
    copy[i][f] = v;
    setSecciones(copy);
  };

  const agregarSeccion = () => {
    setSecciones([...secciones, { id: null, titulo: '', descripcion: '', video: '', imagen: null, imagenOriginal: null }]);
  };

  const seleccionarImagen = async i => {
    if (Platform.OS === 'web') return fileInputsRefs.current[i]?.click();
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return Alert.alert('Permiso denegado');
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!res.canceled) {
      const copy = [...secciones];
      copy[i].imagen = res.assets[0];
      setSecciones(copy);
    }
  };

  const onFileChangeWeb = (e, i) => {
    const file = e.target.files[0];
    const copy = [...secciones];
    copy[i].imagen = { file, uri: URL.createObjectURL(file), name: file.name, type: file.type };
    setSecciones(copy);
  };
const eliminarSeccion = (i) => {
  const copy = [...secciones];
  const sec = copy[i];

  const eliminar = () => {
    if (sec.id) {
      // Llamada a la API usando body con array de IDs
      axios.delete('https://taekwondoitfapp.com/api/auth/secciones', { data: { ids: [sec.id] } })
        .then(() => {
          copy.splice(i, 1);
          setSecciones(copy);
        })
        .catch(err => {
          console.error(err);
          if (Platform.OS === 'web') {
            alert('Error al eliminar sección');
          } else {
            Alert.alert('Error', 'Error al eliminar sección');
          }
        });
    } else {
      // Si no tiene ID (nueva sección no guardada), solo la quitamos del estado
      copy.splice(i, 1);
      setSecciones(copy);
    }
  };

  // Confirmación según plataforma
  if (Platform.OS === 'web') {
    if (window.confirm('¿Estás seguro que querés eliminar esta sección?')) {
      eliminar();
    }
  } else {
    Alert.alert(
      'Eliminar sección',
      '¿Estás seguro que querés eliminar esta sección?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: eliminar },
      ]
    );
  }
};

  const guardar = async () => {
    try {
      const method = teoriaId ? 'put' : 'post';
      const url = teoriaId
        ? `https://taekwondoitfapp.com/api/auth/informacion/${teoriaId}`
        : 'https://taekwondoitfapp.com/auth/informacion';

      const fd = new FormData();
      fd.append('titulo', teoria.titulo);
      fd.append('descripcion', teoria.descripcion);
      fd.append('tipo', teoria.tipo);
      fd.append('id_tul', teoria.id_tul.toString());
      fd.append('fecha', new Date().toISOString());

      fd.append('secciones', JSON.stringify(
        secciones.map(sec => ({
          id: sec.id,
          titulo: sec.titulo,
          descripcion: sec.descripcion,
          video: sec.video,
          imagen: sec.imagenOriginal,
          imagenNueva: !!sec.imagen?.file,
        }))
      ));

      secciones.forEach((sec, idx) => {
        if (sec.imagen?.file) {
          fd.append('imagenes', sec.imagen.file, sec.imagen.name);
        } else if (sec.imagen?.uri && !sec.imagen.uri.includes('/uploads/')) {
          let uri = sec.imagen.uri;
          if (!uri.startsWith('file://')) uri = 'file://' + uri;
          const ext = uri.split('.').pop().toLowerCase();
          const mime = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
          fd.append('imagenes', { uri, name: `imagen${idx}.${ext}`, type: mime });
        }
      });

      await axios({ method, url, data: fd, headers: { 'Content-Type': 'multipart/form-data' } });

      setMensaje('Guardado exitoso 🎉');
      setTipoMensaje('exito');
      if (teoriaId) setImageTimestamp(Date.now());
      setTimeout(() => setMensaje(''), 5000);
    } catch (e) {
      console.error(e);
      setMensaje('Error al guardar');
      setTipoMensaje('error');
      setTimeout(() => setMensaje(''), 5000);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40, flex: 1 }} />;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{teoriaId ? 'Editar Contenido' : 'Crear teoría'}</Text>

       

        <Text style={styles.label}>Título principal</Text>
        <TextInput style={styles.input} value={teoria.titulo} onChangeText={t => setTeoria(p => ({ ...p, titulo: t }))} />
        <Text style={styles.label}>Descripción</Text>
        <TextInput style={styles.input} value={teoria.descripcion} onChangeText={d => setTeoria(p => ({ ...p, descripcion: d }))} />
{secciones.map((sec, i) => (
  <View key={i} style={styles.seccion}>
    {/* Encabezado de sección con título y botón de eliminar */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.label}>Sección ({i + 1})</Text>
      <TouchableOpacity onPress={() => eliminarSeccion(i)}>
        <Text style={{ color: 'grey', fontWeight: 'bold', fontSize: 18 }}>X</Text>
      </TouchableOpacity>
    </View>

    {/* Campos de la sección */}
    <TextInput
      style={styles.input}
      value={sec.titulo}
      placeholder="Título sección"
      onChangeText={t => handleChange(i, 'titulo', t)}
    />
    <TextInput
      style={styles.textarea}
      multiline
      value={sec.descripcion}
      placeholder="Descripción sección"
      onChangeText={d => handleChange(i, 'descripcion', d)}
    />
    <Text style={styles.label}>Imagen</Text>
    <TouchableOpacity style={styles.uploadBox} onPress={() => seleccionarImagen(i)}>
      {sec.imagen ? (
        <Image source={sec.imagen} style={styles.image} />
      ) : (
        <Text style={styles.placeholder}>Selecciona una imagen</Text>
      )}
    </TouchableOpacity>
    {Platform.OS === 'web' && (
      <input
        type="file"
        style={{ display: 'none' }}
        ref={el => (fileInputsRefs.current[i] = el)}
        onChange={e => onFileChangeWeb(e, i)}
      />
    )}
    <Text style={styles.label}>Video (URL)</Text>
    <TextInput
      style={styles.input}
      value={sec.video}
      placeholder="URL video"
      onChangeText={v => handleChange(i, 'video', v)}
    />
  </View>
))}

        <TouchableOpacity style={styles.buttonOutlined} onPress={agregarSeccion}>
          <Text style={styles.buttonTextBlack}>Agregar Sección</Text>
        </TouchableOpacity>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.tipoRow}>
            <TouchableOpacity style={[styles.tipoBtn, teoria.tipo === 'PRO' && styles.tipoBtnActive]} onPress={() => setTeoria(p => ({ ...p, tipo: 'PRO' }))}>
              <Text style={[styles.tipoText, teoria.tipo === 'PRO' && styles.tipoTextActive]}>PRO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tipoBtn, teoria.tipo === 'BASICO' && styles.tipoBtnActive]} onPress={() => setTeoria(p => ({ ...p, tipo: 'BASICO' }))}>
              <Text style={[styles.tipoText, teoria.tipo === 'BASICO' && styles.tipoTextActive]}>BÁSICO</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.buttonPrimary} onPress={guardar}>
          <Text style={styles.buttonTextWhite}>{teoriaId ? 'Guardar cambios' : 'Crear teoría'}</Text>
        </TouchableOpacity>
         {mensaje ? (
          <View style={[styles.mensajeBox, tipoMensaje === 'exito' ? styles.mensajeExito : styles.mensajeError]}>
            <Text style={styles.mensajeTexto}>{mensaje}</Text>
          </View>
        ) : null}
        <TouchableOpacity style={styles.buttonOutlined} onPress={() => navigation.goBack()}>
  <Text style={styles.buttonTextBlack}>Cancelar</Text>
</TouchableOpacity>

      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  title: { fontWeight: 'bold', fontSize: 20, marginBottom: 12 },
  mensajeBox: { padding: 12, borderRadius: 6, marginBottom: 16 },
  mensajeExito: { backgroundColor: '#d4edda', borderColor: '#28a745', borderWidth: 1 },
  mensajeError: { backgroundColor: '#f8d7da', borderColor: '#dc3545', borderWidth: 1 },
  mensajeTexto: { color: '#000', fontSize: 14 },
  label: { fontWeight: '600', marginVertical: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 8 },
  textarea: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, height: 80, textAlignVertical: 'top', marginBottom: 8 },
  uploadBox: { borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed', padding: 20, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  placeholder: { color: '#999' },
  image: { width: '100%', height: 250,  resizeMode: 'contain', borderRadius: 6, backgroundColor: 'withe' },
  tipoRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  tipoBtn: { flex: 1, backgroundColor: '#eee', padding: 12, borderRadius: 6, alignItems: 'center' },
  tipoBtnActive: { backgroundColor: '#000' },
  tipoText: { color: '#000', fontWeight: 'bold' },
  tipoTextActive: { color: '#fff' },
  buttonPrimary: { backgroundColor: '#000', padding: 14, borderRadius: 6, alignItems: 'center', marginBottom: 10 },
  buttonOutlined: { borderWidth: 1, borderColor: '#000', padding: 14, borderRadius: 6, alignItems: 'center', marginBottom: 20 },
  buttonTextWhite: { color: '#fff', fontWeight: 'bold' },
  buttonTextBlack: { color: '#000', fontWeight: 'bold' },
  seccion: { marginBottom: 20 },
});
