import shapefile from 'shapefile';

/**
 * Obtém o polígono de uma propriedade com base no código do imóvel e no estado.
 * Os arquivos são definidos com base no estado fornecido.
 * @param {string} codImovel - Código do imóvel.
 * @param {string} estado - Estado (ex: "SP" ou "MG").
 * @returns {Promise<Object>} - Polígono no formato GeoJSON.
 */
const getPolygonByCodImovelAndState = async (codImovel, estado) => {
  try {
    // Define os caminhos dos arquivos com base no estado
    // const shapefiles = {
    //   SP: {
    //     shp: '../../dataset/São Paulo/AREA_IMOVEL_1.shp',
    //     dbf: '../../dataset/São Paulo/AREA_IMOVEL_1.dbf',
    //   },
    //   MG: {
    //     shp: '../../dataset/Minas Gerais/AREA_IMOVEL_1.shp',
    //     dbf: '../../dataset/Minas Gerais/AREA_IMOVEL_1.dbf',
    //   },
    // };

    // Verifica se o estado é válido
    if (!shapefiles[estado]) {
      throw new Error(`Estado inválido: ${estado}. Use "SP" ou "MG".`);
    }

    // Obtém os caminhos do Shapefile
    const { shp, dbf } = shapefiles[estado];

    // Abrindo o Shapefile
    const source = await shapefile.open(shp, dbf);

    let feature;
    while ((feature = await source.read()).done === false) {
      // Verifica o estado e o código do imóvel
      if (feature.value.cod_imovel === codImovel) {
        return feature.geometry; // Retorna o polígono da propriedade
      }
    }

    // Caso o imóvel não seja encontrado
    throw new Error(`Imóvel com código "${codImovel}" não encontrado no estado ${estado}!`);
  } catch (error) {
    console.error('Erro ao acessar o shapefile:', error);
    throw error;
  }
};

// Exportando a função
export { getPolygonByCodImovelAndState };
