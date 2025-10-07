import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator, Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';

const DIAS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const TURNOS = ['Mañana','Tarde','Noche'];
const CLASES = ['Niños','Adultos','Harmony','Clases especiales'];

export default function EditEscuela() {
  const navigation = useNavigation();
  const route = useRoute();
  const { escuelaId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre:'', direccion:'', ciudad:'',
    instructor:'', instructorMayor:'',
    contacto:'', dias:[], clases:[],
  });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  useEffect(() => {
    if (escuelaId) {
      axios.get(`https://taekwondoitfapp.com/api/auth/escuelas/${escuelaId}`)
        .then(res => {
          const d = res.data;
          setForm({
            nombre: d.nombre || '',
            direccion: d.direccion || '',
            ciudad: d.ciudad || '',
            instructor: d.instructor || '',
            instructorMayor: d.instructor_mayor || '',
            contacto: d.contacto || '',
            dias: d.dias ? d.dias.split(',') : [],
            clases: d.clases ? d.clases.split(',') : [],
          });
        })
        .catch(err => {
          console.error(err);
          setMsg('No se pudo cargar datos');
          setMsgType('error');
        })
        .finally(() => setLoading(false));
    }
  }, [escuelaId]);

  const handleInput = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const toggle = (field, val) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val)
        ? f[field].filter(i => i !== val)
        : [...f[field], val],
    }));
    if (msg) setMsg('');
  };
const handleDelete = () => {
  axios.delete(`https://taekwondoitfapp.com/api/auth/escuelas/${escuelaId}`)
    .then(() => {
      setMsg('Dojan eliminado exitosamente');
      setMsgType('success');
      setTimeout(() => navigation.goBack(), 2000);
    })
    .catch(err => {
      console.error(err);
      setMsg('No se pudo eliminar el dojan');
      setMsgType('error');
    });
};

  const handleSave = () => {
    const { nombre, direccion, ciudad, instructor, instructorMayor, contacto, dias, clases } = form;
    if (!nombre || !direccion || !ciudad || !instructor || !instructorMayor || !contacto) {
      setMsg('Completa todos los campos'); setMsgType('error'); return;
    }
    if (dias.length === 0 || clases.length === 0) {
      setMsg('Selecciona días y clases'); setMsgType('error'); return;
    }
    const payload = {
      nombre, direccion, ciudad, pais:'ARG',
      instructor, instructor_mayor: instructorMayor,
      contacto, dias: dias.join(','), clases: clases.join(',')
    };
    axios.put(`https://taekwondoitfapp.com/api/auth/escuelas/${escuelaId}`, payload)
      .then(() => {
        setMsg('Guardado exitoso'); setMsgType('success');
      })
      .catch(err => {
        console.error(err);
        setMsg('Error al guardar'); setMsgType('error');
      });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Editar Escuela</Text>

        {['nombre','direccion','ciudad','instructor','instructorMayor','contacto'].map(field => (
          <React.Fragment key={field}>
            <Text style={styles.label}>
              {{
                nombre: 'Nombre', direccion: 'Dirección', ciudad: 'Ciudad',
                instructor: 'Instructor', instructorMayor: 'Instructor Mayor',
                contacto: 'Contacto'
              }[field]}
            </Text>
            <TextInput
              style={styles.input}
              value={form[field]}
              placeholder=""
              onChangeText={txt => handleInput(field, txt)}
              keyboardType={field==='contacto'?'email-address':'default'}
            />
          </React.Fragment>
        ))}

        <Text style={styles.label}>Días y horarios</Text>
        {DIAS.map(dia => (
          <View key={dia} style={styles.rowDia}>
            <Text style={styles.diaTexto}>{dia}:</Text>
            <View style={styles.turnosContainer}>
              {TURNOS.map(turno => {
                const val = `${dia} - ${turno}`, sel = form.dias.includes(val);
                return (
                  <TouchableOpacity
                    key={turno}
                    style={[styles.toggleBtn, sel && styles.activeBtn]}
                    onPress={() => toggle('dias', val)}
                  >
                    <Text style={sel?styles.toggleTextActive:styles.toggleText}>{turno}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <Text style={styles.label}>Clases para</Text>
        <View style={styles.row3}>
          {CLASES.slice(0,3).map(cl => (
            <TouchableOpacity
              key={cl}
              style={[styles.col3, form.clases.includes(cl)&&styles.activeBtn]}
              onPress={() => toggle('clases', cl)}
            >
              <Text style={form.clases.includes(cl)?styles.toggleTextActive:styles.toggleText}>{cl}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {CLASES[3] && (
          <TouchableOpacity
            style={[styles.colFull, form.clases.includes(CLASES[3])&&styles.activeBtn]}
            onPress={() => toggle('clases', CLASES[3])}
          >
            <Text style={form.clases.includes(CLASES[3])?styles.toggleTextActive:styles.toggleText}>
              {CLASES[3]}
            </Text>
          </TouchableOpacity>
        )}

        {msg !== '' && (
          <View style={[styles.msgContainer, msgType==='success'?styles.msgSuccess:styles.msgError]}>
            <Text style={styles.msgText}>{msg}</Text>
          </View>
        )}

        <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave}>
          <Text style={styles.btnText}>Guardar</Text>
        </TouchableOpacity>
 <TouchableOpacity
  style={styles.deleteBtn}
  onPress={handleDelete}
>
  <Text style={styles.deleteText}>Eliminar</Text>
</TouchableOpacity>


        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => navigation.goBack()}>
          <Text style={styles.btnCancel}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  loader:{flex:1, justifyContent:'center',alignItems:'center'},
  container:{padding:20},
  heading:{fontSize:22,fontWeight:'bold',marginBottom:16, alignSelf:'center'},
  label:{marginTop:12,fontWeight:'600'},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding: Platform.OS==='ios'?14:10, marginBottom:8},
  rowDia:{flexDirection:'row',alignItems:'center',marginBottom:10},
  diaTexto:{width:80,fontWeight:'bold'},
  turnosContainer:{flexDirection:'row',flexWrap:'wrap'},
  toggleBtn:{backgroundColor:'#f0f0f0',padding:8,paddingHorizontal:12,borderRadius:8,marginRight:8,marginBottom:8},
  activeBtn:{backgroundColor:'#000'},
  toggleText:{color:'#000'},
  toggleTextActive:{color:'#fff',fontWeight:'600'},
  row3:{flexDirection:'row',justifyContent:'space-between',marginBottom:10},
  col3:{width:'30%',padding:10,backgroundColor:'#eee',borderRadius:8,alignItems:'center'},
  colFull:{width:'100%',padding:10,backgroundColor:'#eee',borderRadius:8,alignItems:'center',marginBottom:8},
  btn:{borderRadius:8,paddingVertical:14,alignItems:'center',marginTop:12},
  saveBtn:{backgroundColor:'#000'},
  btnText:{color:'#fff',fontSize:16},
  cancelBtn:{borderWidth:1,borderColor:'#000',backgroundColor:'#fff'},
  btnCancel:{color:'#000',fontSize:16},
  msgContainer:{padding:12,borderRadius:8,marginTop:10},
  msgSuccess:{backgroundColor:'#d4edda'},
  msgError:{backgroundColor:'#f8d7da'},
  msgText:{textAlign:'center',fontWeight:'600'},
  deleteBtn: {
  backgroundColor: '#e30613', // rojo fuerte
  borderColor: '#000',        // borde negro
  borderWidth: 2,
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  marginTop: 12,
  alignItems: 'center',
},
deleteText: {
  color: '#fff',              // texto blanco
  fontWeight: 'bold',
  fontSize: 16,
},

});
