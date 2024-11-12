const apiKey = "18206943674e4c20bbc89cbdb3a223a2";
const keyword = "agro";
const url = `https://newsapi.org/v2/everything?q=${keyword}&language=pt&apiKey=${apiKey}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const filteredNews = data.articles.map(article => ({
      title: article.title,
      url: article.url
    }));
    console.log(filteredNews);
  })
  .catch(error => console.error("Erro ao buscar as notícias:", error));
