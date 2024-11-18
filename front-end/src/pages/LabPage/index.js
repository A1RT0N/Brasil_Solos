import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text, ScrollView, CheckBox, Picker, TouchableOpacity } from 'react-native';

export default function LabPage() {
  const [form, setForm] = useState({
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

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const toggleCheckbox = (field, value) => {
    const updatedArray = form[field].includes(value)
      ? form[field].filter((item) => item !== value)
      : [...form[field], value];
    setForm({ ...form, [field]: updatedArray });
  };

  const processarDados = () => {
    alert('Dados processados com sucesso!');
    console.log(form);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Preencha os Dados da Propriedade</Text>

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
      {['Para consumo da família', 'Para comércio', 'Lavoura', 'Horta', 'Pomar', 'Pequena criação', 'Pecuária', 'Produtos derivados e processados'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('tipoProducao', item)}>
          <Text style={form.tipoProducao.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Culturas</Text>
      {['Algodão', 'Arroz', 'Café', 'Cana de açúcar', 'Feijão', 'Mandioca', 'Milho', 'Soja', 'Trigo'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('culturas', item)}>
          <Text style={form.culturas.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Outras culturas (especificar)"
        value={form.outrosCulturas}
        onChangeText={(text) => handleInputChange('outrosCulturas', text)}
      />

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
      <Text style={styles.label}>Disponibilidade de água no ano inteiro?</Text>
      <TouchableOpacity onPress={() => handleInputChange('aguaAnoInteiro', !form.aguaAnoInteiro)}>
        <Text style={form.aguaAnoInteiro ? styles.selectedOption : styles.option}>
          {form.aguaAnoInteiro ? 'Sim' : 'Não'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.label}>Utiliza irrigação?</Text>
      <TouchableOpacity onPress={() => handleInputChange('irrigacao', !form.irrigacao)}>
        <Text style={form.irrigacao ? styles.selectedOption : styles.option}>
          {form.irrigacao ? 'Sim' : 'Não'}
        </Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Tempo de uso da irrigação (anos)"
        value={form.tempoIrrigacao}
        onChangeText={(text) => handleInputChange('tempoIrrigacao', text)}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Energia</Text>
      {['Rede da Cidade', 'Energia Solar', 'Energia Eólica', 'Gás', 'Outra'].map((item) => (
        <TouchableOpacity key={item} onPress={() => handleInputChange('fonteEnergia', item)}>
          <Text style={form.fonteEnergia === item ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Gasto em conta de luz (R$)"
        value={form.gastoLuz}
        onChangeText={(text) => handleInputChange('gastoLuz', text)}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Transporte</Text>
      {['Carro Flex', 'Carro Álcool', 'Carro Gasolina', 'Barco', 'Avião'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('transporte', item)}>
          <Text style={form.transporte.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Gasto com combustíveis (R$)"
        value={form.gastoCombustivel}
        onChangeText={(text) => handleInputChange('gastoCombustivel', text)}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Mudanças Climáticas</Text>
      {['Seca', 'Inundação', 'Enchente'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('mudancasClimaticas', item)}>
          <Text style={form.mudancasClimaticas.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Outras mudanças (especificar)"
        value={form.outrosMudancas}
        onChangeText={(text) => handleInputChange('outrosMudancas', text)}
      />

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
  label: {
    color: '#FFF',
    marginBottom: 10,
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
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});
