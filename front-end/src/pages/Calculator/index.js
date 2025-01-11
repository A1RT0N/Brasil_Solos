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
    { label: 'Dólar', value: 'https://www.cepea.esalq.usp.br/br/serie-de-preco/dolar.aspx' },
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

  const extractTableDataDolar = (tableHtml) => {
    // ----------- 1) Extrair conteúdo do <thead> -----------
    const theadStart = tableHtml.indexOf('<thead>');
    const theadEnd = tableHtml.indexOf('</thead>');
    
    let headers = [];
    
    if (theadStart !== -1 && theadEnd !== -1) {
      // Captura a parte do texto que corresponde ao <thead>
      const theadContent = tableHtml.substring(theadStart, theadEnd + 8); // +8 para incluir '</thead>'
  
      // Agora vamos percorrer manualmente cada <th> dentro desse trecho
      let searchStart = 0;
      while (true) {
        // Encontra o próximo <th
        const thOpenTagIndex = theadContent.indexOf('<th', searchStart);
        if (thOpenTagIndex === -1) {
          break; // Não há mais <th>
        }
        
        // Pula até o '>' que fecha a tag de abertura <th ...>
        const thOpenTagCloseIndex = theadContent.indexOf('>', thOpenTagIndex);
        if (thOpenTagCloseIndex === -1) {
          break; // Não encontrou fechamento de <th ...>
        }
        
        // Encontra o </th>
        const thCloseTagIndex = theadContent.indexOf('</th>', thOpenTagCloseIndex);
        if (thCloseTagIndex === -1) {
          break; // Não encontrou </th>
        }
        
        // Extrai o conteúdo entre <th> e </th>
        const thInnerText = theadContent
          .substring(thOpenTagCloseIndex + 1, thCloseTagIndex)
          .trim()
          .replace(/&nbsp;/g, '');
  
        headers.push(thInnerText);
  
        // Atualiza o índice de pesquisa para continuar procurando <th> adiante
        searchStart = thCloseTagIndex + 5; // +5 para pular o '</th>'
      }
    }
  
    // ----------- 2) Extrair conteúdo do <tbody> -----------
    const tbodyStart = tableHtml.indexOf('<tbody>');
    const tbodyEnd = tableHtml.indexOf('</tbody>');
    
    let rows = [];
  
    if (tbodyStart !== -1 && tbodyEnd !== -1) {
      // Captura a parte do texto que corresponde ao <tbody>
      const tbodyContent = tableHtml.substring(tbodyStart, tbodyEnd + 8); // +8 para incluir '</tbody>'
  
      // Vamos percorrer cada <tr> dentro do tbody
      let trSearchStart = 0;
      while (true) {
        // Encontra o próximo <tr
        const trOpenTagIndex = tbodyContent.indexOf('<tr', trSearchStart);
        if (trOpenTagIndex === -1) {
          break; // Não há mais <tr>
        }
  
        // Pula até o '>' que fecha a tag de abertura <tr ...>
        const trOpenTagCloseIndex = tbodyContent.indexOf('>', trOpenTagIndex);
        if (trOpenTagCloseIndex === -1) {
          break; // Não encontrou fechamento de <tr>
        }
  
        // Encontra o </tr>
        const trCloseTagIndex = tbodyContent.indexOf('</tr>', trOpenTagCloseIndex);
        if (trCloseTagIndex === -1) {
          break; // Não encontrou </tr>
        }
  
        // Extrai o conteúdo interno do <tr> (onde estarão os <td>)
        const trInner = tbodyContent.substring(trOpenTagCloseIndex + 1, trCloseTagIndex);
  
        // Agora percorremos cada <td> dentro do trInner
        let rowData = [];
        let tdSearchStart = 0;
        while (true) {
          const tdOpenTagIndex = trInner.indexOf('<td', tdSearchStart);
          if (tdOpenTagIndex === -1) {
            break; // Não há mais <td>
          }
  
          // Pula até o '>' que fecha a tag de abertura <td ...>
          const tdOpenTagCloseIndex = trInner.indexOf('>', tdOpenTagIndex);
          if (tdOpenTagCloseIndex === -1) {
            break; // Não encontrou fechamento de <td>
          }
  
          // Encontra o </td>
          const tdCloseTagIndex = trInner.indexOf('</td>', tdOpenTagCloseIndex);
          if (tdCloseTagIndex === -1) {
            break; // Não encontrou </td>
          }
  
          // Extrai o conteúdo entre <td> e </td>
          const tdInnerText = trInner
            .substring(tdOpenTagCloseIndex + 1, tdCloseTagIndex)
            .trim();
  
          rowData.push(tdInnerText);
  
          // Atualiza o índice de pesquisa para continuar procurando <td> adiante
          tdSearchStart = tdCloseTagIndex + 5; // +5 para pular o '</td>'
        }
  
        rows.push(rowData);
  
        // Atualiza o índice de pesquisa de <tr> para o próximo <tr>
        trSearchStart = trCloseTagIndex + 5; // +5 para pular o '</tr>'
      }
    }
  
    // Força sempre o primeiro header a ser "Data"
    if (headers.length > 0) {
      headers[0] = 'Data';
    }
  
    // Retorna o objeto com headers e rows
    return {
      headers,
      rows
    };
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


      console.log(tableContent);



      let tableData;
      if (input === 'https://www.cepea.esalq.usp.br/br/serie-de-preco/dolar.aspx') {
        tableData = extractTableDataDolar(tableContent);
      } else {
        tableData = extractTableData(tableContent);
      }

      

      setData(tableData);
    } catch (error) {
      console.error('Erro ao buscar HTML:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#343541" />
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>Pesquisa de Indicadores CEPAE - ESALQ</Card.Title>
        <Card.Divider />
        <Text style={styles.label}>Clique e Escolha o indicador:</Text>
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
          <View style={{ height: 30 }} />
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
    height: 60,
    backgroundColor: '#1E5F74',
  },
  text: {
    margin: 6,
    color: '#FFF',
    textAlign: 'center',
  },
});