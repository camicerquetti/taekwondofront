import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Image, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import Header from '../components/header';

const EditarTeoria = () => {
  const route = useRoute();
  const { id } = route.params || {};

  const [form, setForm] = useState({
    tituloPrincipal: '',
    deberes: '',
    secciones: Array(3).fill({ titulo: '', descripcion: '', imagen: '' }),
    coloresCinturon: '',
    imagenCinturon: '',
    seccionesCuerpo: '',
    imagenCuerpo: '',
    posicionPreparatoria: '',
    imagenPosicion: '',
    logotipo: '',
    tul: '',
    video: '',
    imagenTul: '',
    contenido: 'PRO',
  });

  const [selectedImage, setSelectedImage] = useState(null);

  // Cargar datos del tul cuando el componente monta o cambia el id
  useEffect(() => {
    if (!id) return;

    const fetchTul = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/tules/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          alert('Error al cargar tul: ' + (errorData.message || 'Error desconocido'));
          return;
        }
        const data = await response.json();

        // Si el backend devuelve las secciones, las usamos, sino dejamos el array vacío
        setForm({
          tituloPrincipal: data.tituloPrincipal || '',
          deberes: data.deberes || '',
          secciones: data.secciones?.length === 3 ? data.secciones : Array(3).fill({ titulo: '', descripcion: '', imagen: '' }),
          coloresCinturon: data.coloresCinturon || '',
          imagenCinturon: data.imagenCinturon || '',
          seccionesCuerpo: data.seccionesCuerpo || '',
          imagenCuerpo: data.imagenCuerpo || '',
          posicionPreparatoria: data.posicionPreparatoria || '',
          imagenPosicion: data.imagenPosicion || '',
          logotipo: data.logotipo || '',
          tul: data.tul || '',
          video: data.video || '',
          imagenTul: data.imagenTul || '',
          contenido: data.contenido || 'PRO',
        });

        if (data.imagenTul) setSelectedImage(data.imagenTul);

      } catch (error) {
        alert('Error al obtener datos: ' + error.message);
      }
    };

    fetchTul();
  }, [id]);

  const handleChange = (field, value) =>
    setForm({ ...form, [field]: value });

  const handleSectionChange = (index, field, value) => {
    const updated = [...form.secciones];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, secciones: updated });
  };

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para acceder a la galería');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      setForm({ ...form, imagenTul: uri });
    }
  };

  const handleSave = async () => {
    if (!id) {
      alert('No se encontró el ID del tul');
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'secciones') formData.append(key, value);
      });

      form.secciones.forEach((sec, i) => {
        formData.append(`secciones[${i}][titulo]`, sec.titulo);
        formData.append(`secciones[${i}][descripcion]`, sec.descripcion);
        formData.append(`secciones[${i}][imagen]`, sec.imagen);
      });

      if (selectedImage && selectedImage.startsWith('file://')) {
        const filename = selectedImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';

        formData.append('imagenTulFile', {
          uri: selectedImage,
          name: filename,
          type,
        });
      }

      const response = await fetch(`http://localhost:5000/api/auth/tules/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // NO poner Content-Type, fetch lo establece automáticamente con FormData
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert('Tule actualizado correctamente');
      } else {
        alert('Error al actualizar: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al guardar');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header />
      <Text style={styles.title}>Editar teoría</Text>

      <TextInput style={styles.input} placeholder="Título de la teoría"
        onChangeText={text => handleChange('tituloPrincipal', text)}
        value={form.tituloPrincipal} />
      <TextInput style={styles.input} placeholder="Deberes del estudiante"
        onChangeText={text => handleChange('deberes', text)}
        value={form.deberes} />

      {form.secciones.map((sec, i) => (
        <View key={i}>
          <TextInput style={styles.input} placeholder={`Título (${i + 1})`}
            onChangeText={text => handleSectionChange(i, 'titulo', text)}
            value={sec.titulo} />
          <TextInput style={styles.textArea} placeholder="Descripción"
            multiline onChangeText={text => handleSectionChange(i, 'descripcion', text)}
            value={sec.descripcion} />
          <TextInput style={styles.input} placeholder="Imagen (URL o descripción)"
            onChangeText={text => handleSectionChange(i, 'imagen', text)}
            value={sec.imagen} />
        </View>
      ))}

      <TextInput style={styles.textArea} placeholder="Significado de colores del cinturón"
        multiline onChangeText={text => handleChange('coloresCinturon', text)}
        value={form.coloresCinturon} />
      <TextInput style={styles.input} placeholder="Imagen cinturón"
        onChangeText={text => handleChange('imagenCinturon', text)}
        value={form.imagenCinturon} />

      <TextInput style={styles.textArea} placeholder="Secciones del cuerpo"
        multiline onChangeText={text => handleChange('seccionesCuerpo', text)}
        value={form.seccionesCuerpo} />
      <TextInput style={styles.input} placeholder="Imagen cuerpo"
        onChangeText={text => handleChange('imagenCuerpo', text)}
        value={form.imagenCuerpo} />

      <TextInput style={styles.textArea} placeholder="Posición preparatoria"
        multiline onChangeText={text => handleChange('posicionPreparatoria', text)}
        value={form.posicionPreparatoria} />
      <TextInput style={styles.input} placeholder="Imagen posición"
        onChangeText={text => handleChange('imagenPosicion', text)}
        value={form.imagenPosicion} />

      <TextInput style={styles.textArea} placeholder="Logotipo"
        multiline onChangeText={text => handleChange('logotipo', text)}
        value={form.logotipo} />

      <TextInput style={styles.textArea} placeholder="Tul"
        multiline onChangeText={text => handleChange('tul', text)}
        value={form.tul} />
      <TextInput style={styles.input} placeholder="Video (YouTube)"
        onChangeText={text => handleChange('video', text)}
        value={form.video} />
      <TextInput style={styles.input} placeholder="Imagen del tul"
        onChangeText={text => handleChange('imagenTul', text)}
        value={form.imagenTul} />

      <TouchableOpacity style={styles.saveButton} onPress={pickImage}>
        <Text style={styles.saveText}>Subir imagen</Text>
      </TouchableOpacity>

      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.toggleButton, form.contenido === 'PRO' && styles.active]}
          onPress={() => handleChange('contenido', 'PRO')}>
          <Text style={[styles.buttonText, { color: form.contenido === 'PRO' ? '#fff' : '#000' }]}>PRO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, form.contenido === 'BASICO' && styles.active]}
          onPress={() => handleChange('contenido', 'BASICO')}>
          <Text style={[styles.buttonText, { color: form.contenido === 'BASICO' ? '#fff' : '#000' }]}>BÁSICO</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditarTeoria;

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginVertical: 5 },
  textArea: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginVertical: 5, minHeight: 80 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  toggleButton: { padding: 10, borderWidth: 1, borderColor: '#000', width: 100, alignItems: 'center' },
  active: { backgroundColor: '#000' },
  buttonText: { color: '#fff' },
  saveButton: { backgroundColor: '#000', padding: 15, borderRadius: 6, alignItems: 'center', marginVertical: 10 },
  saveText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: { borderWidth: 1, borderColor: '#000', padding: 15, borderRadius: 6, alignItems: 'center' },
  cancelText: { color: '#000' },
  previewImage: { width: '100%', height: 200, borderRadius: 10, marginVertical: 10 },
});
// Nueva función específica para actualizar la teoría del tul
exports.updateTuleTeoria = async (req, res) => {
  const { id } = req.params;

  console.log('=== DEBUG ACTUALIZACIÓN TEORÍA TULE ===');
  console.log('ID del tule:', id);
  console.log('Archivos recibidos:', req.files);
  console.log('Body recibido:', req.body);

  try {
    // Verificar que el tul existe
    const [rows] = await db.query('SELECT * FROM tuls WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tul no encontrado.' });
    }

    const tuleActual = rows[0];
    console.log('Tule actual en BD:', tuleActual);

    // Extraer datos del body - SOLO CAMPOS DE TEORÍA
    const {
      tituloPrincipal = tuleActual.tituloPrincipal,
      deberes = tuleActual.deberes,
      coloresCinturon = tuleActual.coloresCinturon,
      seccionesCuerpo = tuleActual.seccionesCuerpo,
      posicionPreparatoria = tuleActual.posicionPreparatoria,
      logotipo = tuleActual.logotipo,
      tul = tuleActual.tul,
      video = tuleActual.video,
      contenido = tuleActual.contenido
    } = req.body;

    // Procesar secciones si vienen en el body
    let seccionesData = tuleActual.secciones;
    for (let i = 0; i < 3; i++) {
      const titulo = req.body[`secciones[${i}][titulo]`];
      const descripcion = req.body[`secciones[${i}][descripcion]`];
      const imagen = req.body[`secciones[${i}][imagen]`];
      
      if (titulo !== undefined || descripcion !== undefined || imagen !== undefined) {
        if (!seccionesData) seccionesData = [];
        seccionesData[i] = {
          titulo: titulo || '',
          descripcion: descripcion || '',
          imagen: imagen || ''
        };
      }
    }

    // Manejar imágenes específicas de teoría
    let imagenCinturon = tuleActual.imagenCinturon;
    let imagenCuerpo = tuleActual.imagenCuerpo;
    let imagenPosicion = tuleActual.imagenPosicion;
    let imagenTul = tuleActual.imagenTul;

    // Procesar archivos de imagen si existen
    if (req.files) {
      if (req.files.imagenCinturonFile) {
        // Eliminar imagen anterior si existe
        if (tuleActual.imagenCinturon) {
          const oldPath = path.join(__dirname, '..', 'uploads', tuleActual.imagenCinturon);
          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (err) {
              console.error('Error eliminando imagen cinturón anterior:', err);
            }
          }
        }
        imagenCinturon = req.files.imagenCinturonFile[0].filename;
      }

      if (req.files.imagenCuerpoFile) {
        if (tuleActual.imagenCuerpo) {
          const oldPath = path.join(__dirname, '..', 'uploads', tuleActual.imagenCuerpo);
          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (err) {
              console.error('Error eliminando imagen cuerpo anterior:', err);
            }
          }
        }
        imagenCuerpo = req.files.imagenCuerpoFile[0].filename;
      }

      if (req.files.imagenPosicionFile) {
        if (tuleActual.imagenPosicion) {
          const oldPath = path.join(__dirname, '..', 'uploads', tuleActual.imagenPosicion);
          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (err) {
              console.error('Error eliminando imagen posición anterior:', err);
            }
          }
        }
        imagenPosicion = req.files.imagenPosicionFile[0].filename;
      }

      if (req.files.imagenTulFile) {
        if (tuleActual.imagenTul) {
          const oldPath = path.join(__dirname, '..', 'uploads', tuleActual.imagenTul);
          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (err) {
              console.error('Error eliminando imagen tul anterior:', err);
            }
          }
        }
        imagenTul = req.files.imagenTulFile[0].filename;
      }
    }

    // Actualizar SOLO campos de teoría del tul en la base de datos
    const query = `
      UPDATE tuls SET 
        tituloPrincipal = ?,
        deberes = ?,
        coloresCinturon = ?,
        imagenCinturon = ?,
        seccionesCuerpo = ?,
        imagenCuerpo = ?,
        posicionPreparatoria = ?,
        imagenPosicion = ?,
        logotipo = ?,
        tul = ?,
        video = ?,
        imagenTul = ?,
        contenido = ?
      WHERE id = ?
    `;

    const queryParams = [
      tituloPrincipal,
      deberes,
      coloresCinturon,
      imagenCinturon,
      seccionesCuerpo,
      imagenCuerpo,
      posicionPreparatoria,
      imagenPosicion,
      logotipo,
      tul,
      video,
      imagenTul,
      contenido,
      id
    ];

    console.log('Ejecutando query de teoría con parámetros:', queryParams);

    await db.query(query, queryParams);

    // Obtener el tul actualizado
    const [updatedRows] = await db.query('SELECT * FROM tuls WHERE id = ?', [id]);
    const updatedTul = updatedRows[0];

    // Agregar URLs completas de las imágenes si existen
    if (updatedTul.imagen) {
      updatedTul.imageUri = `http://localhost:5000/uploads/${updatedTul.imagen}`;
    }
    if (updatedTul.imagenCinturon) {
      updatedTul.imagenCinturonUri = `http://localhost:5000/uploads/${updatedTul.imagenCinturon}`;
    }
    if (updatedTul.imagenCuerpo) {
      updatedTul.imagenCuerpoUri = `http://localhost:5000/uploads/${updatedTul.imagenCuerpo}`;
    }
    if (updatedTul.imagenPosicion) {
      updatedTul.imagenPosicionUri = `http://localhost:5000/uploads/${updatedTul.imagenPosicion}`;
    }
    if (updatedTul.imagenTul) {
      updatedTul.imagenTulUri = `http://localhost:5000/uploads/${updatedTul.imagenTul}`;
    }

    console.log('Teoría del tule actualizada exitosamente:', updatedTul);

    return res.status(200).json({ 
      message: 'Teoría del tul actualizada correctamente.',
      tul: updatedTul
    });

  } catch (error) {
    console.error('Error al actualizar teoría del tul:', error);
    return res.status(500).json({ 
      message: 'Error al actualizar la teoría del tul.', 
      error: error.message 
    });
  }
};
