// import React, { useState } from 'react';
// import { View, Text, Button, Alert, ScrollView } from 'react-native';
// // Se ainda não estiver instalado, adicione: npm install @react-native-picker/picker
// import { Picker } from '@react-native-picker/picker';

// export default function Calculator({ navigation }) {
//   const [input, setInput] = useState('');
//   const [data, setData] = useState(null);

//   const options = [
//     { label: 'Açúcar', value: 'https://www.cepea.esalq.usp.br/br/indicador/acucar.aspx' },
//     { label: 'Algodão', value: 'https://www.cepea.esalq.usp.br/br/indicador/algodao.aspx' },
//     { label: 'Arroz', value: 'https://www.cepea.esalq.usp.br/br/indicador/arroz.aspx' },
//     { label: 'Bezerro', value: 'https://www.cepea.esalq.usp.br/br/indicador/bezerro.aspx' },
//     { label: 'Boi', value: 'https://www.cepea.esalq.usp.br/br/indicador/boi-gordo.aspx' },
//     { label: 'Café', value: 'https://www.cepea.esalq.usp.br/br/indicador/cafe.aspx' },
//     { label: 'Citros', value: 'https://www.cepea.esalq.usp.br/br/indicador/citros.aspx' },
//     { label: 'Dólar', value: 'https://www.cepea.esalq.usp.br/br/serie-de-preco/dolar.aspx' },
//     { label: 'Etanol', value: 'https://www.cepea.esalq.usp.br/br/indicador/etanol.aspx' },
//     { label: 'Feijão', value: 'https://www.cepea.esalq.usp.br/br/indicador/feijao.aspx' },
//     { label: 'Frango', value: 'https://www.cepea.esalq.usp.br/br/indicador/frango.aspx' },
//     { label: 'Leite', value: 'https://www.cepea.esalq.usp.br/br/indicador/leite.aspx' },
//     { label: 'Mandioca', value: 'https://www.cepea.esalq.usp.br/br/indicador/mandioca.aspx' },
//     { label: 'Milho', value: 'https://www.cepea.esalq.usp.br/br/indicador/milho.aspx' },
//     { label: 'Ovos', value: 'https://www.cepea.esalq.usp.br/br/indicador/ovos.aspx' },
//     { label: 'Soja', value: 'https://www.cepea.esalq.usp.br/br/indicador/soja.aspx' },
//     { label: 'Suíno', value: 'https://www.cepea.esalq.usp.br/br/indicador/suino.aspx' },
//     { label: 'Tilápia', value: 'https://www.cepea.esalq.usp.br/br/indicador/tilapia.aspx' },
//     { label: 'Trigo', value: 'https://www.cepea.esalq.usp.br/br/indicador/trigo.aspx' },
//   ];

//   const extractTableContent = (htmlString) => {
//     const regex = /<table[^>]*>([\s\S]*?)<\/table>/;
//     const match = htmlString.match(regex);
//     return match ? match[1] : 'Nenhuma tabela encontrada';
//   };

//   const extractTableData = (tableHtml) => {
//     const headerStartIndex = tableHtml.indexOf('<thead>');
//     const headerEndIndex = tableHtml.indexOf('</thead>');
//     const headerSection = tableHtml.slice(headerStartIndex, headerEndIndex);

//     const headers = [];
//     const headerRegex = /<th.*?>(.*?)<\/th>/g;
//     let headerMatch;
//     while ((headerMatch = headerRegex.exec(headerSection)) !== null) {
//       headers.push(headerMatch[1].trim().replace(/&nbsp;/g, ''));
//     }

//     const bodyStartIndex = tableHtml.indexOf('<tbody>');
//     const bodyEndIndex = tableHtml.indexOf('</tbody>');
//     const bodySection = tableHtml.slice(bodyStartIndex, bodyEndIndex);

//     const rows = [];
//     const rowRegex = /<tr.*?>(.*?)<\/tr>/gs;
//     const cellRegex = /<td.*?>(.*?)<\/td>/g;
//     let rowMatch;
//     while ((rowMatch = rowRegex.exec(bodySection)) !== null) {
//       const rowContent = rowMatch[1];
//       const row = [];
//       let cellMatch;
//       while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
//         row.push(cellMatch[1].trim());
//       }
//       rows.push(row);
//     }

//     return { headers, rows };
//   };

//   const extractTableDataDolar = (tableHtml) => {
//     const theadStart = tableHtml.indexOf('<thead>');
//     const theadEnd = tableHtml.indexOf('</thead>');

//     let headers = [];

//     if (theadStart !== -1 && theadEnd !== -1) {
//       const theadContent = tableHtml.substring(theadStart, theadEnd + 8); // +8 para incluir '</thead>'

//       let searchStart = 0;
//       while (true) {
//         const thOpenTagIndex = theadContent.indexOf('<th', searchStart);
//         if (thOpenTagIndex === -1) {
//           break;
//         }

//         const thOpenTagCloseIndex = theadContent.indexOf('>', thOpenTagIndex);
//         if (thOpenTagCloseIndex === -1) {
//           break;
//         }

//         const thCloseTagIndex = theadContent.indexOf('</th>', thOpenTagCloseIndex);
//         if (thCloseTagIndex === -1) {
//           break;
//         }

//         const thInnerText = theadContent
//           .substring(thOpenTagCloseIndex + 1, thCloseTagIndex)
//           .trim()
//           .replace(/&nbsp;/g, '');

//         headers.push(thInnerText);

//         searchStart = thCloseTagIndex + 5; // +5 para pular o '</th>'
//       }
//     }

//     const tbodyStart = tableHtml.indexOf('<tbody>');
//     const tbodyEnd = tableHtml.indexOf('</tbody>');

//     let rows = [];

//     if (tbodyStart !== -1 && tbodyEnd !== -1) {
//       const tbodyContent = tableHtml.substring(tbodyStart, tbodyEnd + 8); // +8 para incluir '</tbody>'

//       let trSearchStart = 0;
//       while (true) {
//         const trOpenTagIndex = tbodyContent.indexOf('<tr', trSearchStart);
//         if (trOpenTagIndex === -1) {
//           break;
//         }

//         const trOpenTagCloseIndex = tbodyContent.indexOf('>', trOpenTagIndex);
//         if (trOpenTagCloseIndex === -1) {
//           break;
//         }

//         const trCloseTagIndex = tbodyContent.indexOf('</tr>', trOpenTagCloseIndex);
//         if (trCloseTagIndex === -1) {
//           break;
//         }

//         const trInner = tbodyContent.substring(trOpenTagCloseIndex + 1, trCloseTagIndex);

//         let rowData = [];
//         let tdSearchStart = 0;
//         while (true) {
//           const tdOpenTagIndex = trInner.indexOf('<td', tdSearchStart);
//           if (tdOpenTagIndex === -1) {
//             break;
//           }

//           const tdOpenTagCloseIndex = trInner.indexOf('>', tdOpenTagIndex);
//           if (tdOpenTagCloseIndex === -1) {
//             break;
//           }

//           const tdCloseTagIndex = trInner.indexOf('</td>', tdOpenTagCloseIndex);
//           if (tdCloseTagIndex === -1) {
//             break;
//           }

//           const tdInnerText = trInner
//             .substring(tdOpenTagCloseIndex + 1, tdCloseTagIndex)
//             .trim();

//           rowData.push(tdInnerText);

//           tdSearchStart = tdCloseTagIndex + 5;
//         }

//         rows.push(rowData);

//         trSearchStart = trCloseTagIndex + 5;
//       }
//     }

//     if (headers.length > 0) {
//       headers[0] = 'Data';
//     }

//     return {
//       headers,
//       rows,
//     };
//   };

//   const handleScrape = async () => {
//     if (!input) {
//       Alert.alert('Erro', 'Por favor, selecione um indicador.');
//       return;
//     }

//     try {
//       const response = await fetch(input);
//       const html = await response.text();

//       const tableContent = extractTableContent(html);

//       let tableData;
//       if (input === 'https://www.cepea.esalq.usp.br/br/serie-de-preco/dolar.aspx') {
//         tableData = extractTableDataDolar(tableContent);
//       } else {
//         tableData = extractTableData(tableContent);
//       }

//       setData(tableData);
//     } catch (error) {
//       Alert.alert('Erro', 'Não foi possível obter os dados.');
//     }
//   };

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       {/* Título */}
//       <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
//         Selecione um Produto
//       </Text>

//       {/* Picker para selecionar o produto */}
//       <Picker
//         selectedValue={input}
//         onValueChange={(itemValue) => setInput(itemValue)}
//         style={{ height: 50, width: '100%' }}
//       >
//         <Picker.Item label="Selecione um produto" value="" />
//         {options.map((option) => (
//           <Picker.Item key={option.value} label={option.label} value={option.value} />
//         ))}
//       </Picker>

//       {/* Botão para buscar os dados */}
//       <View style={{ marginVertical: 20 }}>
//         <Button title="Buscar Dados" onPress={handleScrape} />
//       </View>

//       {/* Exibição dos dados, se houver */}
//       {data && (
//         <ScrollView horizontal>
//           <View>
//             {/* Cabeçalho da tabela */}
//             <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc' }}>
//               {data.headers.map((header, index) => (
//                 <Text
//                   key={index}
//                   style={{
//                     fontWeight: 'bold',
//                     margin: 5,
//                     padding: 5,
//                     minWidth: 80,
//                     textAlign: 'center',
//                   }}
//                 >
//                   {header}
//                 </Text>
//               ))}
//             </View>
//             {/* Linhas da tabela */}
//             {data.rows.map((row, rowIndex) => (
//               <View
//                 key={rowIndex}
//                 style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee' }}
//               >
//                 {row.map((cell, cellIndex) => (
//                   <Text
//                     key={cellIndex}
//                     style={{
//                       margin: 5,
//                       padding: 5,
//                       minWidth: 80,
//                       textAlign: 'center',
//                     }}
//                   >
//                     {cell}
//                   </Text>
//                 ))}
//               </View>
//             ))}
//           </View>
//         </ScrollView>
//       )}
//     </View>
//   );
// }

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';

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

export default function ProdutosAgricolas() {
  const handlePress = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Não foi possível abrir o link:", err)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos Agrícolas - CEPAE</Text>
      <ScrollView contentContainerStyle={styles.buttonList}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handlePress(option.value)}
          >
            <Text style={styles.buttonText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541', 
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF', 
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonList: {
    alignItems: 'stretch',
  },
  button: {
    backgroundColor: '#1E5F74', 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
  },
});
