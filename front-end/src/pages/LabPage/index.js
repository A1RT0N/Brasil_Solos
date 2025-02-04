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
import axios from 'axios';


// Código SICAR de exemplo: MG-3132701-36A6FC6FCCCE4B65B57EAA02DFF5A72F

// Coordenadas Geográficas do Centróide:
// Lat: 18°10'47,78" S
// Long: 41°55'24,5" O

// Área do Imóvel Rural:1.253,36 ha

// API's do AGRO API
// const consumer_key = 'IQIC7kqNI0DVXl23ejDNsR9fb64a';
// const consumer_secret = '2Btdt7fBq17pWdY_aduE2sofUFQa';



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

  const [openMeteoData, setOpenMeteoData] = useState(null);
  const [loadingOpenMeteo, setLoadingOpenMeteo] = useState(true);

   const fetchOpenMeteo = async (latitude, longitude) => {
    try {
      setLoadingOpenMeteo(true);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,precipitation,soil_moisture_1_3cm,windspeed_10m,soil_temperature_18cm,cloudcover,et0_fao_evapotranspiration`;
      const response = await axios.get(url);
      setOpenMeteoData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados na Open-Meteo:', error.message);
    } finally {
      setLoadingOpenMeteo(false);
    }
  };

  useEffect(() => {
    if (data.latitude && data.longitude) {
      fetchOpenMeteo(data.latitude, data.longitude);
    }
  }, [data.latitude, data.longitude]);

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
        return response.data;
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
      const exchangeRate = 5.5; 
      const electricityValueInUSD = parseFloat(data.gastoLuz) / exchangeRate;
  
      const API_KEY_carbono = 'RdDP3Si90TKiPcIkWBBbQ';
      const BASE_URL_carbono = 'https://www.carboninterface.com/api/v1/estimates';

      const response = await axios.post(
        BASE_URL_carbono,
        {
          type: 'electricity',
          electricity_unit: 'kwh',
          electricity_value: electricityValueInUSD, 
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

  const calculateIrrigationDemand = (eto, precipitation = 0, efficiency = 0.85) => {
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
  
    let totalDemand = 0;
  
    data.culturas.forEach((cultura) => {
      if (kcValues[cultura]) {
        const etc = kcValues[cultura] * eto;
  
        const nli = Math.max(etc - precipitation, 0);
  
        const nbi = nli / efficiency;
  
        totalDemand += nbi * 30; 
      }
    });
  
    return totalDemand.toFixed(2); 
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
    dates.forEach((date, index) => {
      const year = new Date(date).getFullYear();
      if (!groupedByYear[year]) {
        groupedByYear[year] = [];
      }
      groupedByYear[year].push({ date, value: values[index] });
    });

    const filteredDates = [];
    const filteredValues = [];
    Object.keys(groupedByYear).forEach((year) => {
      const points = groupedByYear[year];
      const step = Math.max(1, Math.floor(points.length / 5));
      const selectedPoints = points.filter((_, index) => index % step === 0).slice(0, 5);
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
        <Text style={styles.cardTitle}>Condições Climáticas</Text>

        {loadingOpenMeteo ? (
          <Text style={styles.cardContent}>Carregando dados climáticos...</Text>
        ) : openMeteoData?.hourly ? (
          <View>
            <Text style={styles.cardContent}>
              🌡️ Temperatura (2 m):{' '}
              {openMeteoData.hourly.temperature_2m
                ? openMeteoData.hourly.temperature_2m[0]
                : '--'} °C
            </Text>

            <Text style={styles.cardContent}>
              💧 Umidade do Ar (2 m):{' '}
              {openMeteoData.hourly.relativehumidity_2m
                ? openMeteoData.hourly.relativehumidity_2m[0]
                : '--'}%
            </Text>

            <Text style={styles.cardContent}>
              ☔ Precipitação: {openMeteoData.hourly.precipitation
                ? openMeteoData.hourly.precipitation[0]
                : '--'} mm
            </Text>

            <Text style={styles.cardContent}>
              🌱 Umidade do Solo (1 a 3 cm):{' '}
              {openMeteoData.hourly.soil_moisture_1_3cm
                ? openMeteoData.hourly.soil_moisture_1_3cm[0]
                : '--'} m³/m³
            </Text>

            <Text style={styles.cardContent}>
              💨 Velocidade do Vento (10 m):{' '}
              {openMeteoData.hourly.windspeed_10m
                ? openMeteoData.hourly.windspeed_10m[0]
                : '--'} km/h
            </Text>

            <Text style={styles.cardContent}>
              💦 ET₀ (Evapotranspiração de referência):{' '}
              {openMeteoData.hourly.et0_fao_evapotranspiration
                ? openMeteoData.hourly.et0_fao_evapotranspiration[0]
                : '--'} mm
            </Text>

            <Text style={styles.cardContent}>
              ☁️ Cobertura de Nuvens Total: {' '}
              {openMeteoData.hourly.cloudcover
                ? openMeteoData.hourly.cloudcover[0]
                : '--'}%
            </Text>

            <Text style={styles.cardContent}>
              🌡️ Temperatura do Solo (18 cm):{' '}
              {openMeteoData.hourly.soil_temperature_18cm
                ? openMeteoData.hourly.soil_temperature_18cm[0]
                : '--'} °C
            </Text>

            <Text style={styles.cardContent}>
              Fonte: Open Meta Data
            </Text>
          </View>
        ) : (
          <Text style={styles.cardContent}>
            Não foi possível obter os dados climáticos.
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Série Temporal NDVI da Embrapa</Text>
        <Text style={[styles.cardSubtitle, { color: '#FFFFFF' }]}>
        O NDVI (Índice de Vegetação por Diferença Normalizada) monitora a saúde da vegetação, evidenciando mudanças climáticas ao longo do tempo, variando de -1 a 1, onde valores altos indicam plantas saudáveis e valores baixos refletem degradação ou estresse. {'\n'}
        Este gráfico apresenta a variação anual do NDVI de sua propriedade, com 5 registros por ano. Arraste o gráfico para explorar os dados ao longo do tempo.

      </Text>

        {timeSeries ? (
          (() => {
            const { filteredDates, filteredValues } = filterDataByYear(
              timeSeries.listaDatas,
              timeSeries.listaSerie
            );
            const chartWidth = filteredDates.length * 80; 
            return (
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={{
                    labels: filteredDates.map((date) =>
                      new Date(date).getFullYear().toString()
                    ),
                    datasets: [
                      {
                        data: filteredValues,
                      },
                    ],
                  }}
                  width={chartWidth}
                  height={220}
                  yAxisSuffix=""
                  yAxisInterval={1}
                  chartConfig={{
                    backgroundColor: '#343541',
                    backgroundGradientFrom: '#1E1E2C',
                    backgroundGradientTo: '#343541',
                    decimalPlaces: 4,
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
                  bezier={false}
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

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Demanda de Irrigação</Text>
        <Text style={styles.cardContent}>
          Estimativa de volume de água necessário para irrigação com base nas culturas: {calculateIrrigationDemand()} mm/mês. {"\n"}
          Fonte: FAO Irrigation and Drainage Paper 56 (1998)
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Índice de Segurança Hídrica</Text>
        <Text style={styles.cardContent}>
          Índice estimado para sua região: {calculateWaterSecurityIndex()}. {"\n"}
          Fonte: FAO Irrigation and Drainage Paper 56 (1998)
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pegada de Carbono</Text>
        {carbonFootprint ? (
          <Text style={styles.cardContent}>
            Estoque estimado de carbono na propriedade: {carbonFootprint.carbon_mt} tCO₂. {"\n"}
            Fonte: carboninterface.com
          </Text>
        ) : (
          <Text style={styles.cardContent}>
            Erro ao calcular a pegada de carbono. É necessário informar o consumo de energia elétrica.
          </Text>
        )}
      </View>


      <View style={{ height: 10 }} />

      <Button title="Voltar" onPress={onBack} color="#10A37F" />
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}


export default function LabPage() {

  const { globalEmail } = useContext(GlobalContext);

  const [form, setForm] = useState({
    user: globalEmail || "",
    codigoImovel: "",
    tipoProducao: [],
    culturas: [],
    gastoAgua: "",
    fonteAgua: [],
    irrigacao: false,
    tempoIrrigacao: "",
    fonteEnergia: [],
    gastoLuz: "",
    transporte: [],
    gastoCombustivel: "",
    mudancasClimaticas: [],
    outrosMudancas: "",
    produtos: [],
    praticasManejo: [],
    genero: "",
    idade: "",
    perfil: "",
    latitude: "",
    longitude: "",
    areaRural: "",
    aguaAnoInteiro: false,
    frequenciaIrrigacao: "",
    volumeAguaMes: "",
});


  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);



  const [temPropriedade, setTemPropriedade] = useState(false);


  

  const processarDados = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 500);
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
        const data = doc.data();
        setForm((prevForm) => ({
            ...prevForm,
            ...Object.keys(prevForm).reduce((acc, key) => {
                acc[key] = data[key] !== undefined ? data[key] : prevForm[key]; 
                return acc;
            }, {}),
        }));
    });
};


  const handleInputChange = (field, value) => {
    if (field === "latitude" || field === "longitude") {
        setForm({ ...form, [field]: value || "" }); 
        try {
            const decimalValue = dmsToDecimal(value); 
            setForm((prevForm) => ({
                ...prevForm,
                [field]: decimalValue.toString() || "", 
            }));
        } catch (error) {
            console.error(`Erro ao converter ${field}:`, error.message);
        }
    } else if (["volumeAguaMes", "gastoAgua", "gastoLuz", "gastoCombustivel", "idade", "areaRural"].includes(field)) {
        if (!isNaN(value)) {
            setForm((prevForm) => ({
                ...prevForm,
                [field]: value || "0", 
            }));
        } else {
            console.error(`O campo ${field} deve conter apenas valores numéricos.`);
        }
    } else {
        setForm((prevForm) => ({
            ...prevForm,
            [field]: value || "", 
        }));
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

      <Text style={styles.title}>Já preencheu? Se sim, clique:</Text>
      <View style={{ height: 5 }} />

      <Button title="Carregar os dados" onPress={recuperarDados} color="#10A37F" />

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
        placeholderTextColor="#BBB"
      />

      <Text style={styles.sectionSubtitle}>Perfil</Text>
      {['Proprietário Rural', 'Estudante universitário', 'Engenheiro(a) ou Gestor(a) Ambiental'].map((item) => (
        <TouchableOpacity key={item} onPress={() => handleInputChange('perfil', item)}>
          <Text style={form.perfil === item ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Sua Propriedade</Text>



      <View style={[styles.card, { marginBottom: 10 }]}>
  <Text style={[styles.cardContent, { color: '#FFF' }]}>
  Você conhece seu código de propriedade rural (SICAR)? Se não,{' '}
        <Text style={styles.link} onPress={openLink}>
          clique aqui.
        </Text>
  </Text>
</View>

      <View style={[styles.card, { marginBottom: 10 }]}>
  <Text style={[styles.cardContent, { color: '#FFF' }]}>
    Com seu código de propriedade em mãos, faça a consulta da "Área do Imóvel Rural" e da "Coordenadas Geográficas do Centróide" para acessar a latitude (Lat) e longitude (Long), que aparecem em "Dados do Imóvel Rural",{' '}
    <Text style={styles.link} onPress={openLinkConsulta}>
      clicando nesse link.
    </Text>
  </Text>
</View>


<View style={[styles.card, { marginBottom: 10 }]}>
  <Text style={[styles.cardContent, { color: '#FFF' }]}>
  Atenção: quando for colar os dados do SICAR, principalmente a latitude e longitude, eles serão recalculados automaticamente.
  </Text>
</View>
      

      <TextInput
        style={styles.input}
        placeholder="Código do Imóvel Rural (SICAR)"
        value={form.codigoImovel}
        onChangeText={(text) => handleInputChange('codigoImovel', text)}
        keyboardType="numeric"
        placeholderTextColor="#BBB"
      />

    <TextInput
      style={styles.input}
      placeholder={`Obrigatório: Latitude (ex: 18°10'47,78" S)`}
      value={form.latitude}
      onChangeText={(text) => handleInputChange('latitude', text)}
      keyboardType="numeric"
      placeholderTextColor="#BBB"
    />

    <TextInput
      style={styles.input}
      placeholder={`Obrigatório: Longitude (ex: 41°55'24,5" O)`}
      value={form.longitude}
      onChangeText={(text) => handleInputChange('longitude', text)}
      keyboardType="numeric"
      placeholderTextColor="#BBB"
    />


      <TextInput
        style={styles.input}
        placeholder="Obrigatório: Área do imóvel rural que aparece no SICAR"
        value={form.areaRural}
        onChangeText={(text) => handleInputChange('areaRural', text)}
        keyboardType="numeric"
        placeholderTextColor="#BBB"
      />

      

      <Text style={styles.sectionTitle}>Tipo de Produção</Text>
      {[
        'Para consumo da família',
        'Para comércio',
        'Paisagismo',
        'Lavoura',
        'Horta',
        'Pomar',
        'Sistema Agroflorestal',
        'Pecuária',
        'Produtos derivados e processados (agroindústria)',
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
      {['Laticínios', 'Carnes Processadas', 'Doces', 'Conservas'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('produtos', item)}>
          <Text style={form.produtos.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}

    <TextInput
        style={styles.input}
        placeholder="Outros"
        value={form.produtos}
        onChangeText={(text) => handleInputChange('produtos', text)}
        placeholderTextColor="#BBB"
    />



      <Text style={styles.sectionTitle}>Segurança Hídrica</Text>

      
      <Text style={styles.sectionSubtitle}>Água usada na propriedade</Text>
      {['Rede da Cidade', 'Poço', 'Rio, lago, açude, represa'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('fonteAgua', item)}>
          <Text style={form.fonteAgua.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}

<Text style={styles.sectionSubtitle}>Tem água o ano inteiro?</Text>
{['Sim', 'Não'].map((item) => (
  <TouchableOpacity key={item} onPress={() => handleInputChange('aguaAnoInteiro', item === 'Sim')}>
    <Text style={form.aguaAnoInteiro === (item === 'Sim') ? styles.selectedOption : styles.option}>
      {item}
    </Text>
  </TouchableOpacity>
))}

<Text style={styles.sectionSubtitle}>Utiliza algum sistema de irrigação?</Text>
{['Sim', 'Não'].map((item) => (
  <TouchableOpacity key={item} onPress={() => handleInputChange('irrigacao', item === 'Sim')}>
    <Text style={form.irrigacao === (item === 'Sim') ? styles.selectedOption : styles.option}>
      {item}
    </Text>
  </TouchableOpacity>
))}

<TextInput
  style={styles.input}
  placeholder="Qual a frequência de irrigação?"
  value={form.frequenciaIrrigacao}
  onChangeText={(text) => handleInputChange('frequenciaIrrigacao', text)}
  placeholderTextColor="#BBB"
/>

<TextInput
  style={styles.input}
  placeholder="Gasto em volume de água por mês (litros)"
  value={form.volumeAguaMes}
  onChangeText={(text) => handleInputChange('volumeAguaMes', text)}
  keyboardType="numeric"
  placeholderTextColor="#BBB"
/>
<TextInput
        style={styles.input}
        placeholder="Gasto em conta de água (R$)"
        value={form.gastoAgua}
        onChangeText={(text) => handleInputChange('gastoAgua', text)}
        keyboardType="numeric"
        placeholderTextColor="#BBB"
      />

      <Text style={styles.sectionTitle}>Fonte de Energia na Propriedade</Text>
      {['Rede da Cidade', 'Energia Solar', 'Energia Eólica', 'Gás'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('fonteEnergia', item)}>
          <Text style={form.fonteEnergia.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
       <TextInput
    style={styles.input}
    placeholder="Outra fonte de energia"
    value={form.outraFonteEnergia} 
    onChangeText={(text) => handleInputChange('outraFonteEnergia', text)}
    placeholderTextColor="#BBB"
/>

<TextInput
    style={styles.input}
    placeholder="Gasto mensal com energia elétrica (R$)"
    value={form.gastoLuz}
    onChangeText={(text) => handleInputChange('gastoLuz', text)}
    keyboardType="numeric"
    placeholderTextColor="#BBB"
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
        placeholderTextColor="#BBB"
      />



      <Text style={styles.sectionTitle}>Práticas de Manejo do Solo</Text>
      {['Adubação Verde', 'Plantio Direto', 'Rotação de Culturas', 'Reflorestamento'].map((item) => (
        <TouchableOpacity key={item} onPress={() => toggleCheckbox('praticasManejo', item)}>
          <Text style={form.praticasManejo.includes(item) ? styles.selectedOption : styles.option}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
      <TextInput
    style={styles.input}
    placeholder="Outras práticas de manejo"
    value={form.outrasPraticasManejo} 
    onChangeText={(text) => handleInputChange('outrasPraticasManejo', text)}
    placeholderTextColor="#BBB"
/>


<Text style={styles.sectionTitle}>Meios de Transporte</Text>
{[
  'Uso próprio - sem transporte',
  'Carro Elétrico',
  'Carro a Álcool',
  'Carro a Gasolina',
  'Trator',
  'Barco',
  'Avião',
  'Máquinas Agrícolas',
  'Bomba Hidráulica',
].map((item) => (
  <TouchableOpacity key={item} onPress={() => toggleCheckbox('transporte', item)}>
    <Text style={form.transporte.includes(item) ? styles.selectedOption : styles.option}>
      {item}
    </Text>
  </TouchableOpacity>
))}

<TextInput
  style={styles.input}
  placeholder="Gasto mensal com combustíveis (R$)"
  value={form.gastoCombustivel}
  onChangeText={(text) => handleInputChange('gastoCombustivel', text)}
  keyboardType="numeric"
  placeholderTextColor="#BBB"
/>



      <View style={{ height: 10 }} />


      <Button title="Salvar Dados" onPress={registrarDados} color="#10A37F" />

      <View style={{ height: 10 }} />


      <Button title="Processar Dados" onPress={processarDados} color="#10A37F" />

      <View style={{ height: 30 }} />

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
    marginTop: 5,
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


