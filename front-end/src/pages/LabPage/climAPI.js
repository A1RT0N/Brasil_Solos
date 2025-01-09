import axios from 'axios';

/**
 * Função para buscar dados climáticos do Open-Meteo
 * @param {number} latitude - A latitude da localização
 * @param {number} longitude - A longitude da localização
 * @returns {Promise<Object>} - Retorna os dados climáticos formatados ou lança um erro
 */
const fetchWeatherData = async (latitude, longitude) => {
  try {
    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error("Latitude ou longitude inválidas.");
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,uv_index_max,rain_sum,precipitation_hours,wind_speed_10m_max,wind_direction_10m_dominant,et0_fao_evapotranspiration&timezone=America/Sao_Paulo`;

    const response = await axios.get(url);

    if (response.data && response.data.daily) {
      const { daily } = response.data;

      // Formata os dados para serem retornados
      return {
        time: daily.time,
        temperature2mMax: daily.temperature_2m_max,
        temperature2mMin: daily.temperature_2m_min,
        uvIndexMax: daily.uv_index_max,
        rainSum: daily.rain_sum,
        precipitationHours: daily.precipitation_hours,
        windSpeed10mMax: daily.wind_speed_10m_max,
        windDirection10mDominant: daily.wind_direction_10m_dominant,
        et0FaoEvapotranspiration: daily.et0_fao_evapotranspiration,
      };
    } else {
      throw new Error("Resposta inesperada da API.");
    }
  } catch (error) {
    console.error("Erro ao buscar dados climáticos:", error.message);
    throw error; // Repassa o erro para ser tratado na função principal
  }
};

// Exporta a função para uso em outros arquivos
module.exports = fetchWeatherData;
