import axios from 'axios';

// Função para consultar a API do CAR
export async function consultarCAR(car, handleResults) {
  const API_URL = 'https://api.infosimples.com/api/v2/consultas/car/imovel';
  const API_TOKEN = 'XUHAuBNoVph6pJKw8QDfTnOWkzH6FZQxuO3pzpz6';

  const params = {
    car: car, // Valor do CAR passado como parâmetro
    token: API_TOKEN, // Token da API
    timeout: 300, // Timeout da requisição
  };

  try {
    // Fazendo uma requisição POST para a API usando axios
    const response = await axios.post(API_URL, params);

    // Extraindo e processando os dados
    const results = processResults(response.data);

    // Passando os resultados para a função fornecida (handleResults)
    handleResults(results);
  } catch (error) {
    console.error('Erro ao consultar o CAR:', error.message);
    handleResults(null); // Retorna nulo em caso de erro
  }
}

// Função para processar os resultados da API
function processResults(response) {
  if (response.code === 200 && response.data && response.data.length > 0) {
    const data = response.data[0];

    // Extrair os resultados desejados
    const results = {
      area: data.area, // Área da propriedade
      polygon: data.coordenadas, // Polígono da propriedade
      cityState: data.municipio, // Cidade e estado
    };

    return results;
  } else {
    console.error('Resposta inválida ou sem sucesso:', response);
    return null;
  }
}
