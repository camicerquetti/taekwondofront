import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/header';
import Footer from '../components/footer';
import { Picker } from '@react-native-picker/picker';

const beltIcons = [
  { id: '0-0', image: require('../assets/images/Frame 427318971.jpg'), belt: { color: 'blanco', puntas: 0, tipo: 'gup' } },
  { id: '0-1', image: require('../assets/images/Group 8999 (2).jpg'), belt: { color: 'amarillo', puntas: 1, tipo: 'gup' } },
  { id: '1-0', image: require('../assets/images/Group 8998.jpg'), belt: { color: 'amarillo', puntas: 2, tipo: 'gup' } },
  { id: '1-1', image: require('../assets/images/Group 9000 (3).jpg'), belt: { color: 'verde', puntas: 1, tipo: 'gup' } },
  { id: '2-0', image: require('../assets/images/Group 9001.jpg'), belt: { color: 'verde', puntas: 2, tipo: 'gup' } },
  { id: '2-1', image: require('../assets/images/Group 9002.jpg'), belt: { color: 'azul', puntas: 1, tipo: 'gup' } },
  { id: '3-0', image: require('../assets/images/Frame 427318974.jpg'), belt: { color: 'azul', puntas: 2, tipo: 'gup' } },
  { id: '3-1', image: require('../assets/images/Group 9004.jpg'), belt: { color: 'rojo', puntas: 1, tipo: 'gup' } },
  { id: '4-0', image: require('../assets/images/Group 9005.jpg'), belt: { color: 'rojo', tipo: 'gup' } },
  { id: '5-0', image: require('../assets/images/Group 9006.jpg'), belt: { color: 'rojo', puntas: 2, tipo: 'gup' } },
  { id: '6-0', image: require('../assets/images/Group 9007.jpg'), belt: { color: 'negro', dan: 2, tipo: 'dan' } },
];

export default function ConfirmRegister() {
  const route = useRoute();
  const navigation = useNavigation();
  const { username } = route.params || {};

  const [pais, setPais] = useState('Argentina');
  const [rol, setRol] = useState('Instructor');
  const [esInstructorMayor, setEsInstructorMayor] = useState(false);
  const [nombreInstructorMayor, setNombreInstructorMayor] = useState('');
  const [listaInstructoresMayores, setListaInstructoresMayores] = useState([]);
  const [loadingInstructores, setLoadingInstructores] = useState(false);

  const [selectedBeltId, setSelectedBeltId] = useState(null);
  const [graduacion, setGraduacion] = useState(null);
  const [edad, setEdad] = useState('');
  const [dojang, setDojang] = useState(null);
  const [mensajeRegistro, setMensajeRegistro] = useState('');

  const selectedBelt = beltIcons.find(icon => icon.id === selectedBeltId)?.belt;

  // --- CARGA DE INSTRUCTORES MAYORES ---
  useEffect(() => {
    if (rol === 'Instructor' && !esInstructorMayor) {
      setLoadingInstructores(true);
      fetch('https://taekwondoitfapp.com/api/auth/escuelas')
        .then(res => res.json())
        .then(data => {
          const instructoresUnicos = [...new Set(data.map(e => e.instructor_mayor).filter(Boolean))];
          setListaInstructoresMayores(instructoresUnicos);
          if (instructoresUnicos.length > 0) setNombreInstructorMayor(instructoresUnicos[0]);
          else setNombreInstructorMayor('');
        })
        .catch(err => {
          console.error('Error cargando instructores mayores:', err);
          setListaInstructoresMayores([]);
          setNombreInstructorMayor('');
        })
        .finally(() => setLoadingInstructores(false));
    } else {
      setListaInstructoresMayores([]);
      setNombreInstructorMayor('');
    }
  }, [rol, esInstructorMayor]);

  const traducirRolParaBackend = (rol) => {
    switch (rol) {
      case 'Instructor': return 'profesor';
      case 'Practicante': return 'estudiante';
      case 'Padre/Madre': return 'padre';
      default: return 'otro';
    }
  };

  const handleFinalRegister = async () => {
    if (!username) {
      setMensajeRegistro('❌ Error: username no definido');
      return;
    }

    const selectedBelt = beltIcons.find(icon => icon.id === selectedBeltId)?.belt;

    const datos = {
      username,
      pais,
      // Guardamos 'instructor_mayor' si el usuario marca Sí
      role: esInstructorMayor ? 'instructor_mayor' : traducirRolParaBackend(rol),
      fecha_nacimiento: edad || '00-00-0000',
      belt: selectedBelt || null,
      graduacion,
      // instructor_mayor se guarda siempre con el nombre correspondiente
      instructor_mayor: nombreInstructorMayor.trim() !== '' ? nombreInstructorMayor : 'N/A',
      dojang,
    };

    try {
      const response = await fetch('https://taekwondoitfapp.com/api/auth/register-step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        const resultado = await response.json();
        console.log('✅ Registro guardado:', resultado);
        setMensajeRegistro('✅ ¡Registro exitoso!');
        setTimeout(() => navigation.navigate('LoginScreen'), 1000);
      } else {
        console.error('❌ Error en la respuesta:', response.status);
        setMensajeRegistro('❌ Error al guardar el registro');
        setTimeout(() => navigation.navigate('LoginScreen'), 1000);
      }
    } catch (error) {
      console.error('❌ Error en la red:', error);
      setMensajeRegistro('❌ Error de conexión al servidor');
      setTimeout(() => navigation.navigate('LoginScreen'), 1000);
    }
  };

  const renderIcons = (items, selectedId, setSelected) => (
    <View style={styles.iconGrid}>
      {items.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => setSelected(item.id)}>
          <Image
            source={item.image}
            style={[styles.iconImage, selectedId === item.id && styles.iconSelected]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Image
          source={require('../assets/images/TaeKwonDo.jpg')}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>Completa tu registro</Text>

        <Text style={styles.label}>País</Text>
        <View style={styles.input}>
          <Picker selectedValue={pais} onValueChange={setPais}>
            {['Argentina','Brasil','Chile','Colombia','México','España','Perú','Uruguay','Paraguay','Venezuela','Estados Unidos','Canadá','Alemania','Francia','Italia','Japón','Corea del Sur','China','Reino Unido','Otros'].map((p) => (
              <Picker.Item key={p} label={p} value={p} />
            ))}
          </Picker>
        </View>
        <Text style={styles.subLabel}>Elige tu país de residencia</Text>

        <Text style={styles.label}>Me desempeño como</Text>
        <View style={styles.buttonGroup}>
          {[{ label:'Instructor', value:'Instructor'},{ label:'Practicante', value:'Practicante'},{ label:'Tutor', value:'Padre/Madre'}].map((item)=>( 
            <TouchableOpacity key={item.value} style={[styles.rolBtn, rol===item.value && styles.selectedBtn]} onPress={()=>setRol(item.value)}>
              <Text style={[styles.rolText, rol===item.value && styles.selectedText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {rol==='Instructor' && (
          <>
            <Text style={styles.label}>¿Eres el Instructor Mayor?</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={[styles.rolBtn, esInstructorMayor && styles.selectedBtn]} onPress={()=>setEsInstructorMayor(true)}>
                <Text style={[styles.rolText, esInstructorMayor && styles.selectedText]}>SÍ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.rolBtn, !esInstructorMayor && styles.selectedBtn]} onPress={()=>setEsInstructorMayor(false)}>
                <Text style={[styles.rolText, !esInstructorMayor && styles.selectedText]}>NO</Text>
              </TouchableOpacity>
            </View>

            {!esInstructorMayor && (
              <>
                <Text style={styles.label}>Selecciona el Instructor Mayor</Text>
                {loadingInstructores ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <View style={styles.input}>
                    <Picker selectedValue={nombreInstructorMayor} onValueChange={setNombreInstructorMayor}>
                      {listaInstructoresMayores.length>0 ? listaInstructoresMayores.map((nombre)=>(
                        <Picker.Item key={nombre} label={nombre} value={nombre} />
                      )) : <Picker.Item label="No hay instructores disponibles" value="" />}
                    </Picker>
                  </View>
                )}
              </>
            )}
          </>
        )}

        <Text style={styles.label}>Selecciona tu grado actual</Text>
        {renderIcons(beltIcons, selectedBeltId, setSelectedBeltId)}

        <Text style={styles.label}>Mi graduación es</Text>
        <View style={styles.graduacionGroup}>
          {['I a III Dan','IV a VI Dan','Master VII','Master VIII','Gran Master'].map((item)=>(
            <TouchableOpacity key={item} disabled={selectedBelt?.color!=='negro'} style={[styles.graduacionBtn, graduacion===item && styles.selectedBtn, selectedBelt?.color!=='negro' && {opacity:0.5}]} onPress={()=>setGraduacion(item)}>
              <Text style={[styles.graduacionText, graduacion===item && styles.selectedText, selectedBelt?.color!=='negro' && {color:'#999'}]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <div style={{width:'100%'}}>
          <input
            type="date"
            value={edad}
            onChange={(e)=>setEdad(e.target.value)}
            style={{
              width:'100%',
              padding:12,
              border:'none',
              fontSize:16,
              outline:'none',
              backgroundColor:'transparent',
            }}
          />
        </div>

        {mensajeRegistro!=='' && (
          <View style={{marginVertical:10}}>
            <Text style={{color: mensajeRegistro.includes('✅') ? 'green' : 'red'}}>{mensajeRegistro}</Text>
            {mensajeRegistro.includes('✅') && (
              <TouchableOpacity style={styles.goToLoginBtn} onPress={()=>navigation.navigate('LoginScreen')}>
                <Text style={styles.goToLoginText}>Ir a Login</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.registerBtn} onPress={handleFinalRegister}>
          <Text style={styles.registerText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff'},
  scrollContainer:{padding:20,alignItems:'center'},
  image:{width:'100%',height:180,borderRadius:6,marginBottom:10},
  title:{fontSize:22,fontWeight:'bold',marginBottom:16},
  label:{alignSelf:'flex-start',fontWeight:'bold',marginBottom:6,marginTop:10},
  subLabel:{alignSelf:'flex-start',fontSize:12,color:'#666',marginBottom:8},
  input:{width:'100%',borderWidth:1,borderColor:'#ccc',borderRadius:6,padding:12,marginBottom:10,fontSize:16},
  buttonGroup:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',marginBottom:12,gap:10},
  rolBtn:{borderColor:'#000',borderWidth:1,borderRadius:6,paddingVertical:10,paddingHorizontal:16,marginVertical:4},
  rolText:{fontSize:14,color:'#000'},
  selectedBtn:{backgroundColor:'#000'},
  selectedText:{color:'#fff',fontWeight:'bold'},
  iconGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around',marginVertical:10,gap:10},
  iconImage:{width:50,height:50,margin:6,borderRadius:10},
  iconSelected:{borderWidth:3,borderColor:'#000'},
  registerBtn:{backgroundColor:'#000',paddingVertical:14,borderRadius:6,width:'100%',alignItems:'center',marginTop:10,marginBottom:30},
  registerText:{color:'#fff',fontWeight:'bold',fontSize:16},
  goToLoginBtn:{marginTop:10,backgroundColor:'#000',padding:10,borderRadius:6},
  goToLoginText:{color:'#fff',fontWeight:'bold'},
  graduacionGroup:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',marginBottom:12,gap:10},
  graduacionBtn:{width:'30%',minWidth:100,borderColor:'#000',borderWidth:1,borderRadius:6,paddingVertical:10,paddingHorizontal:8,alignItems:'center',marginVertical:6},
});
