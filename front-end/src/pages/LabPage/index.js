import React, { useEffect, useState, useContext } from 'react';
import { Linking } from 'react-native';
import firebaseConfig from "../../firebase/config";
import { initializeApp } from 'firebase/app';
import { GlobalContext } from '../../contexts/GlobalContext';
import { getFirestore, setDoc, doc, query, where, getDocs, collection } from "firebase/firestore";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';

// Agora, importe o climAPI usando ES Modules:
import fetchWeatherData from './climAPI';



// Código SICAR de exemplo: MG-3132701-36A6FC6FCCCE4B65B57EAA02DFF5A72F

// Coordenadas Geográficas do Centróide:
// Lat: 18°10'47,78" S
// Long: 41°55'24,5" O

// Área do Imóvel Rural:1.253,36 ha



// API's do AGRO API
const consumer_key = 'IQIC7kqNI0DVXl23ejDNsR9fb64a';
const consumer_secret = '2Btdt7fBq17pWdY_aduE2sofUFQa';

import axios from 'axios';


const API_KEY_carbono = 'RdDP3Si90TKiPcIkWBBbQ';
const BASE_URL_carbono = 'https://www.carboninterface.com/api/v1/estimates';


const dmsToDecimal = (dmsString) => {
  const regex = /(\d+)°(\d+)'([\d,]+)"\s*([NSOE])/;
  const match = dmsString.match(regex);

  if (!match) {
    throw new Error('Formato de coordenada inválido. Use o formato: 18°10\'47,78" S');
  }

  const degrees = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseFloat(match[3].replace(',', '.'));
  const direction = match[4];

  let decimal = degrees + minutes / 60 + seconds / 3600;

  if (direction === 'S' || direction === 'O') {
    decimal *= -1;
  }

  return decimal;
};


function ResultPage({ data, onBack }) {
  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeSeries, setTimeSeries] = useState(null);


  const [forecastData, setForecastData] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(true);

  // Função para buscar a previsão do tempo
  const fetchForecast = async (latitude, longitude) => {
    const API_KEY = '2b4df23c7f293b59d8d121952bc7c442'; // Substitua pela sua chave da API OpenWeather
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEY,
          units: 'metric', // Temperatura em Celsius
        },
      });
      setForecastData(response.data);
    } catch (error) {
      console.error('Erro ao buscar previsão do tempo:', error.message);
    } finally {
      setLoadingForecast(false);
    }
  };

  useEffect(() => {
    if (data.latitude && data.longitude) {
      fetchForecast(data.latitude, data.longitude);
    }
  }, [data.latitude, data.longitude]);

  // Função para formatar os dados da previsão
  const formatForecastData = (forecast) => {
    const dailyForecasts = {};
    forecast.forEach((item) => {
      const date = item.dt_txt.split(' ')[0]; // Extrai apenas a data
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(item);
    });

    // Calcula os dados representativos por dia
    return Object.entries(dailyForecasts).map(([date, values]) => {
      const avgTemp = (
        values.reduce((sum, val) => sum + val.main.temp, 0) / values.length
      ).toFixed(1);
      const avgHumidity = (
        values.reduce((sum, val) => sum + val.main.humidity, 0) / values.length
      ).toFixed(1);
      const totalPrecipitation = values
        .reduce((sum, val) => sum + (val.rain?.['3h'] || 0), 0)
        .toFixed(1);

      return {
        date,
        avgTemp,
        avgHumidity,
        totalPrecipitation,
      };
    });
  };



  const getTimeSeries = async (latitude, longitude) => {
    const API_URL = 'https://api.cnptia.embrapa.br/satveg/v2/series'; 
    const token = '3e51ac87-8135-3d7a-b1c5-81fc42578615'; 
  
    try {
      const response = await axios.post(
        API_URL,
        {
          tipoPerfil: 'ndvi',
          satelite: 'comb',
          preFiltro: 3,
          filtro: 'sav',
          parametroFiltro: 4,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data && response.data.listaSerie && response.data.listaDatas) {
        return response.data; // Retorna o objeto completo
      } else {
        throw new Error('Resposta inesperada da API.');
      }
    } catch (error) {
      console.error('Erro ao buscar série temporal:', error.response?.data || error.message);
      return null;
    }
  };


  useEffect(() => {
    const fetchTimeSeries = async () => {
      const timeSeriesData = await getTimeSeries(data.latitude, data.longitude);
      setTimeSeries(timeSeriesData);
    };
  
    fetchTimeSeries();
    calculateCarbonFootprint();
  }, []);


  
  


  const calculateCarbonFootprint = async () => {
    try {
      // Supondo uma taxa de câmbio fixa (exemplo: 1 USD = 5.5 BRL)
      const exchangeRate = 5.5; 
  
      // Converte o valor de gasto em reais para dólares
      const electricityValueInUSD = parseFloat(data.gastoLuz) / exchangeRate;
  
      const response = await axios.post(
        BASE_URL_carbono,
        {
          type: 'electricity',
          electricity_unit: 'kwh',
          electricity_value: electricityValueInUSD, // Consumo convertido para dólares
          country: 'US'
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY_carbono}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data && response.data.data) {
        setCarbonFootprint(response.data.data.attributes);
      } else {
        throw new Error('Resposta inesperada da API');
      }
    } catch (error) {
      console.error('Erro ao calcular a pegada de carbono:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível calcular a pegada de carbono. Verifique os dados inseridos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateCarbonFootprint();
  }, []);


  // Fórmula usada Cálculo N=(ET−P)×A

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
        irrigationDemand += kcValues[cultura] * 5 * 30; 
      }
    });

    return irrigationDemand.toFixed(2);
  };

  const calculateWaterSecurityIndex = () => {
    const gastoAgua = parseFloat(data.gastoAgua || 0);
    if (gastoAgua > 500) return 'Crítico';
    if (gastoAgua > 200) return 'Moderado';
    return 'Adequado';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10A37F" />
        <Text style={styles.loadingText}>Calculando pegada de carbono...</Text>
      </View>
    );
  }

    const filterDataByYear = (dates, values) => {
      const groupedByYear = {};

      // Agrupa os valores por ano
      dates.forEach((date, index) => {
        const year = new Date(date).getFullYear();
        if (!groupedByYear[year]) {
          groupedByYear[year] = [];
        }
        groupedByYear[year].push({ date, value: values[index] });
      });

      // Reduz cada grupo para exatamente 5 pontos por ano
      const filteredDates = [];
      const filteredValues = [];
      Object.keys(groupedByYear).forEach((year) => {
        const points = groupedByYear[year];
        const step = Math.max(1, Math.floor(points.length / 5)); // Escolhe 5 pontos uniformemente

        const selectedPoints = points.filter((_, index) => index % step === 0).slice(0, 5); // Garante no máximo 5
        selectedPoints.forEach((point) => {
          filteredDates.push(point.date);
          filteredValues.push(point.value);
        });
      });

      return { filteredDates, filteredValues };
    };




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
          Índice estimado para sua região: {calculateWaterSecurityIndex()}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pegada de Carbono</Text>
        {carbonFootprint ? (
          <Text style={styles.cardContent}>
            Estoque estimado de carbono na propriedade: {carbonFootprint.carbon_mt} tCO₂
          </Text>
        ) : (
          <Text style={styles.cardContent}>Erro ao calcular a pegada de carbono. É necessário informar o consumo de energia elétrica.</Text>
        )}
      </View>
      
    
      <View style={styles.card}>
      <Text style={styles.cardTitle}>Série Temporal NDVI da Embrapa</Text>
      <Text style={[styles.cardSubtitle, { color: '#FFFFFF' }]}>
      O NDVI (Índice de Vegetação por Diferença Normalizada) é uma ferramenta para monitorar a saúde da vegetação e entender seu papel na sustentabilidade. Calculado a partir de imagens de satélite, esse índice varia de -1 a 1 e reflete a "vitalidade" da vegetação: valores mais altos indicam plantas saudáveis e bem desenvolvidas, enquanto valores baixos podem sugerir áreas degradadas, solo exposto ou vegetação estressada. 
      O NDVI permite identificar áreas com vegetação saudável ou degradada, apoiando suas práticas agrícolas.
      Esse índice reflete como mudanças climáticas, como secas ou enchentes, impactam a vegetação, ajudando a planejar futuras ações. Por meio do apoio das ferramentas da Embrapa, este gráfico mostra a variação do índice NDVI da sua propriedade ao longo dos anos, com 5 valores representativos por ano. Atenção: por ser um serviço pago, pode ser que ele não esteja disponível.
      </Text>
      {timeSeries ? (
        (() => {
          const { filteredDates, filteredValues } = filterDataByYear(
            timeSeries.listaDatas,
            timeSeries.listaSerie
          );

          const chartWidth = filteredDates.length * 80; // Largura dinâmica baseada na quantidade de dados

          return (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <LineChart
                data={{
                  labels: filteredDates.map((date) => new Date(date).getFullYear().toString()), // Rótulos no eixo X
                  datasets: [
                    {
                      data: filteredValues, // Valores filtrados
                    },
                  ],
                }}
                width={chartWidth} // Largura do gráfico ajustada ao número de pontos
                height={220} // Altura do gráfico
                yAxisSuffix=""
                yAxisInterval={1} // Intervalo entre os valores do eixo Y
                chartConfig={{
                  backgroundColor: '#343541',
                  backgroundGradientFrom: '#1E1E2C',
                  backgroundGradientTo: '#343541',
                  decimalPlaces: 4, // Número de casas decimais nos valores
                  color: (opacity = 1) => `rgba(16, 163, 127, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: '#1E5F74',
                  },
                }}
                bezier={false} // Gráfico com linhas retas entre os pontos
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </ScrollView>
          );
        })()
      ) : (
        <Text style={styles.cardContent}>
          Não foi possível carregar os dados da série temporal.
        </Text>
      )}
    </View>


    {/* <View style={styles.card}>
        <Text style={styles.cardTitle}>Previsão do Tempo (Próximos 5 Dias)</Text>
        {loadingForecast ? (
          <ActivityIndicator size="large" color="#10A37F" />
        ) : forecastData ? (
          formatForecastData(forecastData.list).slice(0, 5).map((day, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.cardContent}>📅 Data: {day.date}</Text>
              <Text style={styles.cardContent}>
                🌡️ Temperatura Média: {day.avgTemp}°C
              </Text>
              <Text style={styles.cardContent}>
                💧 Umidade Média: {day.avgHumidity}%
              </Text>
              <Text style={styles.cardContent}>
                🌧️ Precipitação Total: {day.totalPrecipitation} mm
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.cardContent}>
            Não foi possível carregar os dados da previsão.
          </Text>
        )}
      </View> */}





      <Button title="Voltar" onPress={onBack} color="#10A37F" />

          {/* Espaço invisível entre os botões */}
          <View style={{ height: 20 }} />
    </ScrollView>
  );
}


export default function LabPage() {

  const { globalEmail } = useContext(GlobalContext);

  const [form, setForm] = useState({
    user: globalEmail,
    codigoImovel: '',
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
    produtos: [],
    praticasManejo: [],
    genero: '',
    idade: '',
    perfil: '',
    latitude: '',
    longitude: '',
    areaRural: '',
    weather: null,
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

    querySnapshot.forEach((doc) => {
      setForm(doc.data());
    });

  }

  const handleInputChange = (field, value) => {
    if (field === 'latitude' || field === 'longitude') {
      setForm({ ...form, [field]: value }); // Armazena o valor original
      try {
        const decimalValue = dmsToDecimal(value); // Converte para decimal
        setForm({ ...form, [field]: decimalValue.toString() }); // Salva como string decimal
      } catch (error) {
        console.error('Erro ao converter coordenada:', error.message);
      }
    } else {
      setForm({ ...form, [field]: value });
    }
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

  const openLink = () => {
    Linking.openURL('https://consultapublica.car.gov.br/publico/imoveis/index')
      .catch(err => console.error("Não foi possível abrir o link", err));
  };

  

  const openLinkConsulta = () => {
    Linking.openURL('https://www.car.gov.br/#/consultar')
      .catch(err => console.error("Não foi possível abrir o link", err));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Preencha os Dados da Propriedade</Text>

      <Text style={styles.title}>Já preencheu? Se sim:</Text>
      {/* Espaço invisível entre os botões */}
      <View style={{ height: 5 }} />

      <Button title="Carregar os dados" onPress={recuperarDados} color="#10A37F" />

      {/* Espaço invisível entre os botões */}
      <View style={{ height: 5 }} />



      <Text style={styles.sectionTitle}>Sobre Você</Text>

      <Text style={styles.sectionSubtitle}>Gênero</Text>
      {['Homem', 'Mulher', 'Prefiro não declarar'].map((item) => (
        <TouchableOpacity key={item} onPress={() => handleInputChange('genero', item)}>
          <Text style={form.genero === item ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Idade (anos)"
        value={form.idade}
        onChangeText={(text) => handleInputChange('idade', text)}
        keyboardType="numeric"
      />

      <Text style={styles.sectionSubtitle}>Perfil</Text>
      {['Proprietário Rural', 'Estudante USP', 'Engenheiro(a) ou Gestor(a) Ambiental'].map((item) => (
        <TouchableOpacity key={item} onPress={() => handleInputChange('perfil', item)}>
          <Text style={form.perfil === item ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Sua Propriedade</Text>

      <Text style={[styles.text, { marginBottom: 10 }]}>
        Você conhece seu código de propriedade rural (SICAR)? Se não,{' '}
        <Text style={styles.link} onPress={openLink}>
          clique aqui.
        </Text>
      </Text>

      <View style={[styles.card, { marginBottom: 10 }]}>
  <Text style={[styles.cardContent, { color: '#FFF' }]}>
    Com seu código de propriedade em mãos, faça a consulta da "Área do Imóvel Rural" e da "Coordenadas Geográficas do Centróide" para acessar a latitude (Lat) e longitude (Long), que aparecem em "Dados do Imóvel Rural",{' '}
    <Text style={styles.link} onPress={openLinkConsulta}>
      clicando nesse link.
    </Text>
  </Text>
</View>


      <TextInput
        style={styles.input}
        placeholder="Código do Imóvel Rural (SICAR)"
        value={form.codigoImovel}
        onChangeText={(text) => handleInputChange('codigoImovel', text)}
        keyboardType="numeric"
      />

    <TextInput
      style={styles.input}
      placeholder={`Obrigatório: Latitude (ex: 18°10'47,78" S)`}
      value={form.latitude}
      onChangeText={(text) => handleInputChange('latitude', text)}
      keyboardType="numeric"
    />

    <TextInput
      style={styles.input}
      placeholder={`Obrigatório: Longitude (ex: 41°55'24,5" O)`}
      value={form.longitude}
      onChangeText={(text) => handleInputChange('longitude', text)}
      keyboardType="numeric"
    />


      <TextInput
        style={styles.input}
        placeholder="Obrigatório: Área do imóvel rural que aparece no SICAR"
        value={form.areaRural}
        onChangeText={(text) => handleInputChange('areaRural', text)}
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

      <Text style={styles.sectionTitle}>Produtos Derivados e Processados</Text>
      {['Laticínios', 'Carnes Processadas', 'Doces', 'Conservas', 'Outro (digitar)'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('produtos', item)}>
          <Text style={form.produtos.includes(item) ? styles.selectedOption : styles.option}>
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

      <Text style={styles.sectionTitle}>Fonte de Energia na Propriedade</Text>
      {['Rede da Cidade', 'Energia Solar', 'Energia Eólica', 'Gás', 'Outra (digitar)'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('fonteEnergia', item)}>
          <Text style={form.fonteEnergia.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Gasto mensal com energia elétrica (R$)"
        value={form.gastoLuz}
        onChangeText={(text) => handleInputChange('gastoLuz', text)}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Mudanças no Clima</Text>
      {['Seca', 'Inundação', 'Enchente', 'Insetos e Pragas', 'Doenças nas Plantas', 'Doenças nos Animais', 'Doenças na Família'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('mudancasClimaticas', item)}>
          <Text style={form.mudancasClimaticas.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Outras mudanças percebidas"
        value={form.outrosMudancas}
        onChangeText={(text) => handleInputChange('outrosMudancas', text)}
      />



      <Text style={styles.sectionTitle}>Práticas de Manejo do Solo</Text>
      {['Adubação Verde', 'Plantio Direto', 'Rotação de Culturas', 'Reflorestamento', 'Outro (digitar)'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('praticasManejo', item)}>
          <Text style={form.praticasManejo.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}


      {/* Espaço invisível entre os botões */}
      <View style={{ height: 10 }} />


      <Button title="Salvar Dados" onPress={registrarDados} color="#10A37F" />

      {/* Espaço invisível entre os botões */}
      <View style={{ height: 10 }} />


      <Button title="Processar Dados" onPress={processarDados} color="#10A37F" />

      {/* Espaço invisível entre os botões */}
      <View style={{ height: 20 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
    padding: 20,
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#40414F',
    backgroundColor: '#40414F',
    color: '#FFF',
    padding: 10,
    marginTop: 5,
    borderRadius: 8,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  sectionSubtitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
  option: {
    color: '#808080',
    padding: 10,
    marginTop: 5,
    borderRadius: 8,
    backgroundColor: '#40414F',
  },
  selectedOption: {
    color: '#FFF',
    padding: 10,
    marginTop: 5,
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
    marginTop: 5,
    color: '#FFF',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#444654',
    padding: 20,
    marginTop: 5,
    borderRadius: 10,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  cardContent: {
    color: '#FFF',
    fontSize: 16,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 8, 
  },
  link: {
    color: '#10A37F', 
    textDecorationLine: 'underline', 
    marginTop: 8, 
  },
});




// <View style={styles.card}>
// <Text style={styles.cardTitle}>Clima de Hoje na sua propriedade</Text>
// {data.weather ? (
//   <View style={{ marginBottom: 10 }}>
//     <Text style={styles.cardContent}>📅 Data: {data.weather.time}</Text>
//     <Text style={styles.cardContent}>
//       🌡️ Temperatura Máxima: {data.weather.temperature2mMax}°C
//     </Text>
//     <Text style={styles.cardContent}>
//       🌡️ Temperatura Mínima: {data.weather.temperature2mMin}°C
//     </Text>
//     <Text style={styles.cardContent}>
//       🌞 Índice UV Máximo: {data.weather.uvIndexMax}
//     </Text>
//     <Text style={styles.cardContent}>
//       🌧️ Precipitação (mm): {data.weather.rainSum}
//     </Text>
//     <Text style={styles.cardContent}>
//       ⏱️ Horas de Precipitação: {data.weather.precipitationHours}
//     </Text>
//     <Text style={styles.cardContent}>
//       💨 Velocidade Máxima do Vento: {data.weather.windSpeed10mMax} km/h
//     </Text>
//     <Text style={styles.cardContent}>
//       🧭 Direção Dominante do Vento: {data.weather.windDirection10mDominant}°
//     </Text>
//     <Text style={styles.cardContent}>
//       🌾 Evapotranspiração: {data.weather.et0FaoEvapotranspiration} mm
//     </Text>
//   </View>
// ) : (
//   <Text style={styles.cardContent}>
//     ❌ Não foi possível obter os dados climáticos.
//   </Text>
// )}
// </View>