import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Platform, Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/header';
import DateTimePicker from '@react-native-community/datetimepicker';



// Agrego aquí tu mapping para guardar en base correctamente
const beltMapping = {
  '0-0': { color: 'blanco', puntas: 1, tipo: 'gup' },  // blanco sin puntas
  '0-1': { color: 'amarillo', puntas: 1, tipo: 'gup' },
  '0-2': { color: 'amarillo', puntas: 2, tipo: 'gup' },
  '1-0': { color: 'verde', puntas: 1, tipo: 'gup' },
  '1-1': { color: 'verde', puntas: 2, tipo: 'gup' },
  '2-0': { color: 'azul', puntas: 1, tipo: 'gup' },
  '2-1': { color: 'azul', puntas: 2, tipo: 'gup' },
  '3-0': { color: 'rojo', puntas: 1, tipo: 'gup' },
  '3-1': { color: 'rojo', puntas: 2, tipo: 'gup' },
  '4-0': { color: 'negro', dan: 0, tipo: 'dan' },  // negro sin puntas
  '5-0': { color: 'negro', dan: 1, tipo: 'dan' },
  
  // Cinturones con un solo color
  '0-single': { color: 'blanco', puntas: 0, tipo: 'gup' },  // blanco sin puntas
  '1-single': { color: 'amarillo', puntas: 0, tipo: 'gup' },  // amarillo sin puntas
  '2-single': { color: 'verde', puntas: 0, tipo: 'gup' },  // verde sin puntas
  '3-single': { color: 'azul', puntas: 0, tipo: 'gup' },  // azul sin puntas
  '4-single': { color: 'rojo', puntas: 0, tipo: 'gup' },  // rojo sin puntas
  '5-single': { color: 'negro', puntas: 0, tipo: 'dan' },  // negro sin puntas (nuevo)
};



  const beltRows = [
    ['#FFFFFF', '#FFFF00', '#FFFFFF'],
    ['#FFFF02', '#3E7C19', '#FFFF00'],
    ['#069006', '#0000FF', '#3E7C19'],
    ['#0000FF', '#FF0000', '#0000FF'],
    ['#000000','#FF0000',  '#FF0000'],
    ['#000000'],
  ];
  const danOptions = ['I a III Dan', 'IV a VI Dan', 'Master VII', 'Master VIII', 'Gran Master'
];

export default function EditUser() {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.id;

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState(null); // Tipo de cuenta visible
  const [selectedSubscription, setSelectedSubscription] = useState('basico');
  const [expirationDate, setExpirationDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [mensajeBanner, setMensajeBanner] = useState(null);
  const [tipoBanner, setTipoBanner] = useState('success');
const [selectedRole, setSelectedRole] = useState(null);

  const [selectedBelt, setSelectedBelt] = useState(null);
  
  const [selectedDan, setSelectedDan] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Mapeo para guardar role según tipo de cuenta
  const roleMap = {
    'Instructor mayor': 'instructor_mayor',
    'Instructor': 'profesor',
    'Practicante': 'estudiante',
    'Tutor': 'padre',
    'admin': 'admin',
  };

  // Cuando cargamos los datos del usuario, convertimos role base a tipo visible:
  const reverseRoleMap = {
     'instructor_mayor': 'Instructor mayor', // valor de DB → etiqueta visible
    'profesor': 'Instructor',
    'estudiante': 'Practicante',
    'padre': 'Tutor',
    'admin': 'admin', // fallback si fuera admin
  };
const confirmarEliminacion = () => {
  if (Platform.OS === 'web') {
    const confirmado = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (confirmado) handleDelete();
  } else {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: handleDelete, style: 'destructive' },
      ],
      { cancelable: true }
    );
  }
};

function findBeltIndexByObject(beltObj) {
  if (!beltObj) return null;
  for (const [index, data] of Object.entries(beltMapping)) {
    if (
      data.color === beltObj.color &&
      Number(data.puntas || 0) === Number(beltObj.puntas || 0) &&
      data.tipo === beltObj.tipo &&
      Number(data.dan || 0) === Number(beltObj.dan || 0)
    ) {
      return index
      ;
    }
  }
  return null;
}

const handlePress = (i) => {
  const beltObject = { color: i.color, puntas: i.puntas, tipo: i.tipo };
  const beltIndex = findBeltIndexByObject(beltList, beltObject);
  console.log('Índice encontrado:', beltIndex);

  // Si el índice es válido, actualiza el estado.
 if (beltIndex !== null) {
  setSelectedBelt(`${i.color}-${i.puntas}-${i.tipo}-single`);
}

};
  useEffect(() => {
    
    if (!userId) {
      Alert.alert('Error', 'No se encontró el ID del usuario');
      navigation.goBack();
      return;
    }
    fetch(`https://taekwondoitfapp.com/api/auth/usuarios/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar usuario');
        return res.json();
      })
      .then(data => {
        setNombre(data.nombre || '');
        setApellido(data.apellido || '');
        setEmail(data.email || '');
       let beltObj = null;

// Verificar si data.belt existe
if (data.belt) {
  console.log('data.belt recibido:', data.belt); // Verifica lo que se recibe

  // Intentar parsear data.belt si es una cadena JSON
  try {
    // Si es una cadena, parsearlo
    beltObj = typeof data.belt === 'string' ? JSON.parse(data.belt) : data.belt;
    console.log('Objeto belt parseado:', beltObj); // Verifica el objeto después de parsearlo
  } catch (error) {
    // Si hay error en el parseo, lo capturamos
    console.error('Error al parsear belt:', error);
    beltObj = null; // Devolvemos null si hubo un error
  }
} else {
  console.log('No se recibió data.belt');
}

// Ahora puedes verificar el valor de beltObj
if (beltObj) {
  console.log('Belt objeto final:', beltObj);
} else {
  console.log('beltObj es null o no se pudo parsear correctamente');
}

    
        // En la API guardás role y categoria_usuario; para mostrar elegimos según role:
        // Si querés mantener la categoria_usuario original en el select, podés usar:
        // setSelectedAccountType(data.categoria_usuario || 'Practicante');
        // Pero si querés que sea coherente con role, usá este reverseRoleMap:
        setSelectedAccountType(
          data.role ? reverseRoleMap[data.role] || 'Practicante' : 'Practicante'
        );

        setSelectedSubscription(data.plan?.toLowerCase() || 'basico');
        if (data.expiracionSuscripcion) {
          const formattedDate = new Date(data.expiracionSuscripcion).toISOString().split('T')[0];
          setExpirationDate(formattedDate);
        }
 setSelectedBelt(findBeltIndexByObject(beltObj) || null);



        setSelectedDan(data.dan || null);
      })
      .catch(err => {
        Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
        console.error(err);
        navigation.goBack();
      });
  }, [userId]);

  const mostrarBanner = (msg, tipo) => {
    setMensajeBanner(msg);
    setTipoBanner(tipo);
    setTimeout(() => setMensajeBanner(null), 4000);
  };

  const handleGuardarCambios = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (!nombre.trim() || !apellido.trim() || !email.trim()) {
      Alert.alert('Error', 'Completa todos los campos requeridos');
      return;
    }

  

    setIsSaving(true);
  const beltData = beltMapping[selectedBelt];
    const payload = {
      nombre,
      apellido,
      email,
      categoria_usuario: selectedAccountType,
      plan: selectedSubscription,
      role: roleMap[selectedAccountType], // Aquí mapeamos role según categoría
      expiracionSuscripcion: expirationDate,
        ...(beltData
    ? {
        belt: JSON.stringify({
          color: beltData.color,
          puntas: beltData.puntas || 0,
          tipo: beltData.tipo,
        }),
        // Siempre se asigna el valor de `dan`, con un valor predeterminado de 0 si no se ha seleccionado
        dan: (selectedDan !== null && selectedDan !== undefined) ? selectedDan : 0,
      }
    : {}),

  // Si no hay cinturón pero el usuario ha seleccionado `dan`, se incluye en el payload
  ...(selectedDan && !beltData
    ? { dan: selectedDan }
    : {}),
};

console.log('Payload:', payload)

    if (password.trim()) payload.password = password;

    fetch(`https://taekwondoitfapp.com/api/auth/usuarios/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Error al actualizar');
        mostrarBanner('Actualizado correctamente', 'success');
      })
      .catch(err => {
        mostrarBanner(`Error: ${err.message}`, 'error');
        console.error(err);
      })
      .finally(() => setIsSaving(false));
  };

  const handleDelete = () => {
    fetch(`https://taekwondoitfapp.com/api/auth/usuarios/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errBody => {
            throw new Error(errBody.message || `HTTP ${res.status}`);
          });
        }
      })
      .then(() => {
        setMensajeBanner('Usuario eliminado correctamente.');
        setTipoBanner('success');
        setTimeout(() => navigation.goBack(), 1500);
      })
      .catch(err => {
        console.error('Error al eliminar el usuario:', err);
        setMensajeBanner('No se pudo eliminar el usuario.');
        setTipoBanner('error');
      });
  };

  

  return (
    <View style={styles.root}>
      <Header />
      {mensajeBanner && (
        <View style={[styles.banner, tipoBanner === 'success' ? styles.bannerOK : styles.bannerError]}>
          <Text style={styles.bannerText}>{mensajeBanner}</Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar usuario</Text>

        {[['Nombre', nombre, setNombre], ['Apellido', apellido, setApellido], ['Email', email, setEmail]].map(([lbl, val, set], i) => (
          <React.Fragment key={i}>
            <Text style={styles.label}>{lbl}</Text>
            <TextInput
              style={styles.input}
              value={val}
              onChangeText={set}
              placeholder={lbl}
              placeholderTextColor="#999"
              {...(lbl === 'Email' && { keyboardType: 'email-address', autoCapitalize: 'none' })}
            />
          </React.Fragment>
        ))}

        {['Nueva contraseña', 'Confirmar contraseña'].map((lbl, idx) => (
          <React.Fragment key={lbl}>
            <Text style={styles.label}>{lbl}</Text>
            <TextInput
              style={styles.input}
              placeholder={lbl}
              placeholderTextColor="#999"
              secureTextEntry
              value={idx === 0 ? password : confirmPassword}
              onChangeText={idx === 0 ? setPassword : setConfirmPassword}
              autoCapitalize="none"
            />
          </React.Fragment>
        ))}

        <Text style={styles.label}>Tipo de cuenta</Text>
        <View style={styles.row}>
          {['Instructor mayor', 'Instructor', 'Practicante', 'Tutor', 'admin'].map((type, index) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.toggleButton,
                selectedAccountType === type && styles.toggleButtonActive,
                { width: '48%', marginRight: index % 2 === 0 ? '4%' : 0 },
              ]}
              onPress={() => {
                setSelectedAccountType(type);
                setSelectedBelt(null);
                setSelectedDan(null);
              }}
            >
              <Text style={[styles.toggleText, selectedAccountType === type && styles.toggleTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedAccountType === 'Practicante' && (
          <>
            <Text style={styles.label}>Seleccionar cinturón</Text>
            <View style={styles.beltContainer}>
  {beltRows.map((row, i) => (
  <View key={i} style={styles.beltRow}>
    {/* Colores individuales (cuando hay un color solo en la fila) */}
    {row.length % 2 !== 0 && (
      <TouchableOpacity
        style={[
          styles.beltPairContainer,
          selectedBelt === `${i}-single` && styles.beltSelected,
        ]}
     onPress={() => setSelectedBelt(`${i}-single`)}
      >
         <View style={[styles.beltCircle, { backgroundColor: row[row.length - 1] }]} />
      </TouchableOpacity>
    )}

    {/* Pares de colores */}
    {row.map((color, j) => {
      if (j % 2 === 1) return null; // Saltar impares
      if (j + 1 >= row.length) return null; // Evitar desborde
      if (row.length % 2 !== 0 && j === row.length - 2) return null; // Evitar conflicto con el single

      const pairIndex = `${i}-${j}`;
      const isSelected = selectedBelt === pairIndex;

      return (
        <TouchableOpacity
          key={pairIndex}
          style={[styles.beltPairContainer, isSelected && styles.beltSelected]}
          onPress={() => setSelectedBelt(pairIndex)}  // <--- corregido: usar pairIndex
        >
          <View style={[styles.beltCircle, { backgroundColor: row[j] }]} />
          <View style={[styles.beltCircle, { backgroundColor: row[j + 1] }]} />
          
        </TouchableOpacity>
        
      );
      
    })}
  </View>
  
))}

</View>
{/* Mostrar la sección de Dan solo si el cinturón seleccionado es negro (o contiene dan) */}
    {selectedBelt && beltMapping[selectedBelt] && beltMapping[selectedBelt].color === 'negro' && (
      <>
        <Text style={styles.label}>Seleccionar Dan</Text>
        <View style={styles.danContainer}>
          <View style={styles.danColumn}>
            {danOptions.slice(0, 3).map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.toggleButton, selectedDan === d && styles.toggleButtonActive]}
                onPress={() => setSelectedDan(d)}
              >
                <Text style={[styles.toggleText, selectedDan === d && styles.toggleTextActive]}>{d}° Dan</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.danColumn}>
            {danOptions.slice(3).map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.toggleButton, selectedDan === d && styles.toggleButtonActive]}
                onPress={() => setSelectedDan(d)}
              >
                <Text style={[styles.toggleText, selectedDan === d && styles.toggleTextActive]}>{d}° Dan</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </>
    )}
  </>
)}
{/* Para otros tipos de usuarios (Instructor, Tutor, Instructor Mayor), siempre mostramos los Danes */}
{selectedAccountType !== 'Practicante' && (
  <>
    <Text style={styles.label}>Seleccionar Dan</Text>
    <View style={styles.danContainer}>
      <View style={styles.danColumn}>
        {['I a III Dan', 'IV a VI Dan', 'Master VII'].map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.toggleButton, selectedDan === item && styles.toggleButtonActive]}
            onPress={() => setSelectedDan(item)}
          >
            <Text style={[styles.toggleText, selectedDan === item && styles.toggleTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.danColumn}>
        {['Master VIII', 'Gran Master'].map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.toggleButton, selectedDan === item && styles.toggleButtonActive]}
            onPress={() => setSelectedDan(item)}
          >
            <Text style={[styles.toggleText, selectedDan === item && styles.toggleTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </>
)}


        <Text style={styles.label}>Modificar suscripción</Text>
        <View style={styles.subscriptionContainer}>
          {['pro', 'basico'].map(plan => (
            <TouchableOpacity
              key={plan}
              style={[styles.subscriptionButton, selectedSubscription === plan && styles.subscriptionButtonActive]}
              onPress={() => setSelectedSubscription(plan)}
            >
              <Text style={[styles.subscriptionText, selectedSubscription === plan && styles.subscriptionTextActive]}>{plan}</Text>
            </TouchableOpacity>
          ))}
        </View>
        

        <Text style={styles.label}>Fecha de expiración</Text>
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={expirationDate}
            onChange={e => setExpirationDate(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#ccc',
              fontSize: 14,
              color: '#333',
              marginTop: 8,
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        ) : (
          <>
            <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>
                {expirationDate ? new Date(expirationDate).toLocaleDateString() : 'Seleccionar fecha'}
              </Text>
              <Feather name="calendar" size={20} color="#333" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={expirationDate ? new Date(expirationDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (event.type === 'set' && selectedDate) {
                    const formatted = selectedDate.toISOString().split('T')[0];
                    setExpirationDate(formatted);
                  }
                }}
              />
            )}
          </>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleGuardarCambios}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>{isSaving ? 'Guardando...' : 'Guardar cambios'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={[styles.actionButton, styles.deleteButton]}
  onPress={confirmarEliminacion}
>
  <Text style={styles.deleteButtonText}>Eliminar</Text>
</TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  banner: { padding: 10 },
  bannerOK: { backgroundColor: '#d4edda' },
  bannerError: { backgroundColor: '#f8d7da' },
  bannerText: { textAlign: 'center', fontWeight: '600' },
  container: { paddingHorizontal: 20, paddingVertical: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontWeight: '600', fontSize: 14, marginTop: 12, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, justifyContent: 'space-evenly' },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  toggleButtonActive: { backgroundColor: '#000' },
  toggleText: { fontSize: 14, color: '#333', textAlign: 'center' },
  toggleTextActive: { color: '#fff', fontWeight: '600' },
  subscriptionContainer: { marginTop: 8, marginBottom: 16 },
  subscriptionButton: {
    paddingVertical: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  subscriptionButtonActive: { backgroundColor: '#000' },
  subscriptionText: { fontSize: 14, color: '#333', fontWeight: '600' },
  subscriptionTextActive: { color: '#fff' },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  dateText: { fontSize: 14, color: '#333' },
  actionButton: { paddingVertical: 14, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  saveButton: { backgroundColor: '#000' },
  saveButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  beltContainer: { marginTop: 8, alignItems: 'center' },
  beltRow: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'center',
  },
  beltPairContainer: {
    flexDirection: 'row',
    marginHorizontal: 6,
    padding: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  beltCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 2,
  },
  beltSelected: {
    backgroundColor: '#e6e6e6',
    borderColor: '#000',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  danContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  danColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 0,
  },
});
