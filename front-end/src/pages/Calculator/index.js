import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, Alert, ScrollView } from 'react-native';

export default function Calculator({ navigation }) {
  const [input, setInput] = useState('');
  const [data, setData] = useState(null); // Estado para armazenar os dados retornados

  // Função para buscar dados da API de web scraping
  const handleScrape = async () => {
    try {
      const response = await fetch(`http://localhost:3000/scrape?input=${input}`);
      if (!response.ok) {
        throw new Error(`Erro: ${response.statusText}`);
      }
      const scrapedData = await response.json();
      setData(scrapedData); // Armazena os dados no estado
      Alert.alert('Sucesso', 'Dados extraídos com sucesso');
    } catch (error) {
      Alert.alert('Erro', `Erro ao realizar o scraping: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Insira o valor para o indicador:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o valor de INPUT"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Buscar Dados" onPress={handleScrape} />

      {/* Exibe os dados extraídos */}
      {data && (
        <ScrollView style={styles.dataContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.dataRow}>
              {Object.entries(item).map(([key, value]) => (
                <Text key={key} style={styles.dataText}>
                  {key}: {value}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginVertical: 10,
    width: '100%',
  },
  dataContainer: {
    marginTop: 20,
    width: '100%',
  },
  dataRow: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dataText: {
    fontSize: 14,
  },
});
