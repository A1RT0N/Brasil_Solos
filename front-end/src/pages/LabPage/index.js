import React, { useState, useContext } from 'react';
import firebaseConfig from "../../firebase/config"
import { initializeApp } from 'firebase/app'
import { GlobalContext } from '../../contexts/GlobalContext'
import { getFirestore, setDoc, doc, query, where, getDocs,collection } from "firebase/firestore"
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

function ResultPage({ data, onBack }) {
  const calculateIrrigationDemand = () => {
    const kcValues = {
      Algodão: 0.85,
      Arroz: 1.2,
      Café: 0.8,
      Cana: 1.15,
      Feijão: 1.0,
      Mandioca: 0.65,
      Milho: 1.15,
      Soja: 0.9,
      Trigo: 1.15,
    };

    let irrigationDemand = 0;
    data.culturas.forEach((cultura) => {
      if (kcValues[cultura]) {
        irrigationDemand += kcValues[cultura] * 5 * 30; // Cálculo fictício
      }
    });

    return irrigationDemand.toFixed(2);
  };

  

  const waterSecurityIndex = Math.random() > 0.5 ? 'Adequado' : 'Crítico';
  const carbonFootprint = data.tamanhoPropriedade * 10; // Exemplo de cálculo baseado no tamanho da propriedade

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resultados</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Demanda de Irrigação</Text>
        <Text style={styles.cardContent}>
          Estimativa de volume de água necessário para irrigação com base nas culturas: {calculateIrrigationDemand()} mm/mês
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Índice de Segurança Hídrica</Text>
        <Text style={styles.cardContent}>
          Índice estimado para sua região: {waterSecurityIndex}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pegada de Carbono</Text>
        <Text style={styles.cardContent}>
          Estoque estimado de carbono na propriedade: {carbonFootprint} tCO₂
        </Text>
      </View>
      <Button title="Voltar" onPress={onBack} color="#10A37F" />
    </ScrollView>
  );
}

export default function LabPage() {

  const { globalEmail } = useContext(GlobalContext);
  console.log(globalEmail)

  const [form, setForm] = useState({
    user: globalEmail,
    cep: '',
    municipio: '',
    codigoImovel: '',
    tamanhoPropriedade: '',
    tipoProducao: [],
    culturas: [],
    gastoAgua: '',
    fonteAgua: [],
    aguaAnoInteiro: false,
    irrigacao: false,
    tempoIrrigacao: '',
    fonteEnergia: '',
    gastoLuz: '',
    transporte: [],
    gastoCombustivel: '',
    mudancasClimaticas: [],
    outrosMudancas: '',
  });

  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);



  const [temPropriedade, setTemPropriedade] = useState(false);

  const processarDados = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 2000); // Simula carregamento
  };

  const registrarDados = () => {
    

    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const docRef = setDoc(doc(db, "propriedades", globalEmail), form);
    alert('Dados salvos com sucesso')
  }

  const recuperarDados = async () => {

    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const propriedadesRef = collection(db, "propriedades");
    const q = query(propriedadesRef, where("user", "==", globalEmail));
    const querySnapshot = await getDocs(q);

    console.log(querySnapshot.docs);
    querySnapshot.forEach((doc) => {
      setForm(doc.data());
    });

  }

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const toggleCheckbox = (field, value) => {
    const updatedArray = form[field].includes(value)
      ? form[field].filter((item) => item !== value)
      : [...form[field], value];
    setForm({ ...form, [field]: updatedArray });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10A37F" />
        <Text style={styles.loadingText}>Processando os dados...</Text>
      </View>
    );
  }

  if (showResults) {
    return <ResultPage data={form} onBack={() => setShowResults(false)} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Preencha os Dados da Propriedade</Text>

      <Text style={styles.title}>Já preencheu?</Text>
      <Button title="Carregar os dados" onPress={recuperarDados} color="#10A37F" />


      <TextInput
        style={styles.input}
        placeholder="CEP"
        value={form.cep}
        onChangeText={(text) => handleInputChange('cep', text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Município"
        value={form.municipio}
        onChangeText={(text) => handleInputChange('municipio', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Código do Imóvel Rural"
        value={form.codigoImovel}
        onChangeText={(text) => handleInputChange('codigoImovel', text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Tamanho da Propriedade (ha)"
        value={form.tamanhoPropriedade}
        onChangeText={(text) => handleInputChange('tamanhoPropriedade', text)}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Tipo de Produção</Text>
      {[
        'Para consumo da família',
        'Para comércio',
        'Lavoura',
        'Horta',
        'Pomar',
        'Pequena criação',
        'Pecuária',
        'Produtos derivados e processados',
      ].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('tipoProducao', item)}>
          <Text style={form.tipoProducao.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Culturas</Text>
      {['Algodão', 'Arroz', 'Café', 'Cana', 'Feijão', 'Mandioca', 'Milho', 'Soja', 'Trigo'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('culturas', item)}>
          <Text style={form.culturas.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Segurança Hídrica</Text>
      <TextInput
        style={styles.input}
        placeholder="Gasto em conta de água (R$)"
        value={form.gastoAgua}
        onChangeText={(text) => handleInputChange('gastoAgua', text)}
        keyboardType="numeric"
      />
      {['Rede da Cidade', 'Poço', 'Rio, lago, açude, represa'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('fonteAgua', item)}>
          <Text style={form.fonteAgua.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      <Button title="Salvar Dados" onPress={registrarDados} color="#10A37F" />

      <Button title="Processar Dados" onPress={processarDados} color="#10A37F" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#40414F',
    backgroundColor: '#40414F',
    color: '#FFF',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  option: {
    color: '#808080',
    padding: 10,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: '#40414F',
  },
  selectedOption: {
    color: '#FFF',
    padding: 10,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: '#1E5F74',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#343541',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFF',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#444654',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContent: {
    color: '#FFF',
    fontSize: 16,
  },
});
