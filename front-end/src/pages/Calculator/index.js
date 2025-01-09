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
    { label: 'Açúcar', value: 'https://www.cepea.esalq.usp.br/br/indicador/acucar.aspx' },
    { label: 'Algodão', value: 'https://www.cepea.esalq.usp.br/br/indicador/algodao.aspx' },
    { label: 'Arroz', value: 'https://www.cepea.esalq.usp.br/br/indicador/arroz.aspx' },
    { label: 'Bezerro', value: 'https://www.cepea.esalq.usp.br/br/indicador/bezerro.aspx' },
    { label: 'Boi', value: 'https://www.cepea.esalq.usp.br/br/indicador/boi-gordo.aspx' },
    { label: 'Café', value: 'https://www.cepea.esalq.usp.br/br/indicador/cafe.aspx' },
    { label: 'Citros', value: 'https://www.cepea.esalq.usp.br/br/indicador/citros.aspx' },
    { label: 'Etanol', value: 'https://www.cepea.esalq.usp.br/br/indicador/etanol.aspx' },
    { label: 'Feijão', value: 'https://www.cepea.esalq.usp.br/br/indicador/feijao.aspx' },
    { label: 'Frango', value: 'https://www.cepea.esalq.usp.br/br/indicador/frango.aspx' },
    { label: 'Leite', value: 'https://www.cepea.esalq.usp.br/br/indicador/leite.aspx' },
    { label: 'Mandioca', value: 'https://www.cepea.esalq.usp.br/br/indicador/mandioca.aspx' },
    { label: 'Milho', value: 'https://www.cepea.esalq.usp.br/br/indicador/milho.aspx' },
    { label: 'Ovos', value: 'https://www.cepea.esalq.usp.br/br/indicador/ovos.aspx' },
    { label: 'Soja', value: 'https://www.cepea.esalq.usp.br/br/indicador/soja.aspx' },
    { label: 'Suíno', value: 'https://www.cepea.esalq.usp.br/br/indicador/suino.aspx' },
    { label: 'Tilápia', value: 'https://www.cepea.esalq.usp.br/br/indicador/tilapia.aspx' },
    { label: 'Trigo', value: 'https://www.cepea.esalq.usp.br/br/indicador/trigo.aspx' },
  ];

  const extractTableContent = (htmlString) => {
    const regex = /<table[^>]*>([\s\S]*?)<\/table>/;
    const match = htmlString.match(regex);
    return match ? match[1] : 'Nenhuma tabela encontrada';
  };

  const extractTableData = (tableHtml) => {
      // Extract headers manually
      const headerStartIndex = tableHtml.indexOf('<thead>');
      const headerEndIndex = tableHtml.indexOf('</thead>');
      const headerSection = tableHtml.slice(headerStartIndex, headerEndIndex);
  
      const headers = [];
      const headerRegex = /<th.*?>(.*?)<\/th>/g;
      let headerMatch;
      while ((headerMatch = headerRegex.exec(headerSection)) !== null) {
          headers.push(headerMatch[1].trim().replace(/&nbsp;/g, ''));
      }
  
      // Extract rows manually
      const bodyStartIndex = tableHtml.indexOf('<tbody>');
      const bodyEndIndex = tableHtml.indexOf('</tbody>');
      const bodySection = tableHtml.slice(bodyStartIndex, bodyEndIndex);
  
      const rows = [];
      const rowRegex = /<tr.*?>(.*?)<\/tr>/gs;
      const cellRegex = /<td.*?>(.*?)<\/td>/g;
      let rowMatch;
      while ((rowMatch = rowRegex.exec(bodySection)) !== null) {
          const rowContent = rowMatch[1];
          const row = [];
          let cellMatch;
          while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
              row.push(cellMatch[1].trim());
          }
          rows.push(row);
      }
  
      return { headers, rows };
  };

  const handleScrape = async () => {
    if (!input) {
      Alert.alert('Erro', 'Por favor, selecione um indicador.');
      return;
    }

    try {
      const response = await fetch(input);
      const html = await response.text();


      const tableContent = extractTableContent(html);

      const tableData = extractTableData(tableContent);

      setData(tableData);
    } catch (error) {
      console.error('Erro ao buscar HTML:', error);
    }
  };

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
            <Row data={data.headers} style={styles.head} textStyle={styles.text} />
            <Rows data={data.rows} textStyle={styles.text} />
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
    marginBottom: 10, 
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