const apiKey = "18206943674e4c20bbc89cbdb3a223a2";
// TODO: Ver qual a melhor keyword e filtrar melhor depois
const keywords = "plantio";  
const url = `https://newsapi.org/v2/everything?q=${keywords}&language=pt&apiKey=${apiKey}`;
const fs = require('fs');

fetch(url)
  .then(response => response.json())
  .then(data => {
    const filteredNews = data.articles
      .filter(article => article.title && article.title !== "[Removed]")
      .filter(article => {
        const allowedDomains = ["globo.com", "g1.globo.com", "terra.com.br", "infomoney.com.br", "veja.abril.com.br", "metropoles.com"];
        return allowedDomains.some(domain => article.url.includes(domain));
      })
      .map(article => ({
        title: article.title,
        subtitle: article.description || "Sem subtítulo disponível", // Inclui o subtítulo
        url: article.url,
        imageUrl: article.urlToImage && !article.urlToImage.includes('gif') && !article.urlToImage.includes('video') ? article.urlToImage : null
      }))
      .filter(article => article.imageUrl !== null); // Filtra artigos sem imagem válida
      
    fs.writeFile('noticias.json', JSON.stringify(filteredNews, null, 2), 'utf8', (error) => {
      if (error) {
        console.error("Erro ao salvar as notícias:", error);
      } else {
        console.log("Notícias salvas com sucesso em noticias.json");
      }
    });
  })
  .catch(error => console.error("Erro ao buscar as notícias:", error));
