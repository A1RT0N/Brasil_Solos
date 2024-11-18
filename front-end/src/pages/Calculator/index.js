import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Button, Card } from 'react-native-elements';
import { Table, Row, Rows } from 'react-native-table-component';
import RNPickerSelect from 'react-native-picker-select';

export default function Calculator({ navigation }) {
  const [input, setInput] = useState('');
  const [data, setData] = useState(null);

  const options = [
    { label: 'Açúcar', value: 'acucar' },
    { label: 'Algodão', value: 'algodao' },
    { label: 'Arroz', value: 'arroz' },
    { label: 'Bezerro', value: 'bezerro' },
    { label: 'Boi', value: 'boi-gordo' },
    { label: 'Café', value: 'cafe' },
    { label: 'Citros', value: 'citros' },
    { label: 'Etanol', value: 'etanol' },
    { label: 'Feijão', value: 'feijao' },
    { label: 'Frango', value: 'frango' },
    { label: 'Leite', value: 'leite' },
    { label: 'Mandioca', value: 'mandioca' },
    { label: 'Milho', value: 'milho' },
    { label: 'Ovinos', value: 'ovinos' },
    { label: 'Ovos', value: 'ovos' },
    { label: 'Soja', value: 'soja' },
    { label: 'Suíno', value: 'suino' },
    { label: 'Tilápia', value: 'tilapia' },
    { label: 'Trigo', value: 'trigo' },
  ];

  const handleScrape = async () => {
    try {
      const response = await fetch(`http://localhost:3000/scrape?input=${input}`);
      if (!response.ok) {
        throw new Error(`Erro: ${response.statusText}`);
      }
      const scrapedData = await response.json();
      setData(scrapedData);
      Alert.alert('Sucesso', 'Dados extraídos com sucesso');
    } catch (error) {
      Alert.alert('Erro', `Erro ao realizar o scraping: ${error.message}`);
    }
  };

  const getTableHeaders = () => {
    if (data && data.length > 0) {
      return Object.keys(data[0]);
    }
    return [];
  };

  const getTableRows = () => {
    if (data && data.length > 0) {
      return data.map((item) => Object.values(item));
    }
    return [];
  };

  const tableHead = getTableHeaders();
  const tableData = getTableRows();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#343541" />
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>Busca de Indicadores</Card.Title>
        <Card.Divider />
        <Text style={styles.label}>Escolha o indicador:</Text>
        <RNPickerSelect
          onValueChange={(value) => setInput(value)}
          items={options}
          placeholder={{
            label: 'Selecione um indicador...',
            value: null,
            color: '#B0B0B0',
          }}
          style={{
            inputIOS: styles.picker,
            inputAndroid: styles.picker,
            placeholder: styles.placeholder,
          }}
          useNativeAndroidPickerStyle={false}
        />
        <View style={styles.spacing} />
        <Button
          title="Buscar Dados"
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
          onPress={handleScrape}
        />
      </Card>

      {data && (
        <ScrollView style={styles.tableContainer}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#1E5F74' }}>
            <Row data={tableHead} style={styles.head} textStyle={styles.text} />
            <Rows data={tableData} textStyle={styles.text} />
          </Table>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
    padding: 16,
  },
  card: {
    backgroundColor: '#40414F',
    borderRadius: 8,
    padding: 16,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 20,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#40414F',
    backgroundColor: '#1E1E2D',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  placeholder: {
    color: '#B0B0B0',
  },
  button: {
    backgroundColor: '#1E5F74',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  spacing: {
    marginBottom: 10, // Adicionado para criar espaço entre o picker e o botão
  },
  tableContainer: {
    marginTop: 20,
    backgroundColor: '#444654',
    borderRadius: 8,
    padding: 16,
  },
  head: {
    height: 40,
    backgroundColor: '#1E5F74',
  },
  text: {
    margin: 6,
    color: '#FFF',
    textAlign: 'center',
  },
});
