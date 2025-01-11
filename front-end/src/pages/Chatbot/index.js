import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TextInput, Button, Text, RefreshControl } from 'react-native';
import Markdown from 'react-native-markdown-display';
import lammakey from "../../../../env.json";

const LLAMA_KEY = lammakey.LLAMA_KEY;

export default function Chatbot({ navigation }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Olá! Eu sou Iara, a Inteligência Artificial da ESALQ, uma das maiores faculdades de agronomia do Brasil da Universidade de São Paulo. Estou aqui para te instruir sobre o funcionamento do aplicativo, tirar dúvidas e também te informar sobre as principais informações da área rural para ajudar sua propriedade. Antes de começarmos, certifique-se de que está conectado à Internet. Em que posso ajudar?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userQuestions, setUserQuestions] = useState([]); 
  const [botResponses, setBotResponses] = useState([]); 

  const sendMessage = async () => {
    if (!input) return;

    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    setUserQuestions([...userQuestions, input]); 
    setInput('');
    setLoading(true);

    const previousQuestions = userQuestions.join(" | ");
    const previousResponses = botResponses.join(" | ");

    const prompt = `Você é uma inteligência artificial brasileira de agronomia sustentável de nome Iara da ESALQ que já se apresentou e está buscando ajudar o usuário sobre o 
    funcionamento do aplicativo e sobre dúvidas no campo rural. Esse aplicativo possui uma área de informação de preços de produtos de nome "Preços" que se encontra no canto inferior esquerdo do 
    aplicativo. Também possui uma região de cadastro de dados, chamada "Laboratório" que fica no canto inferior direito, que possibilita indicar ao 
    produtor rural novas ferramentas sustentáveis a partir do cadastramento de seus dados. 
    A mensagem do usuário é essa: ${input}. Responda ela adequadamente considerando os fatores já apresentados. Caso necessário, indique os seguintes sites para ele fazer mais pesquisas: 
    https://www.embrapa.br/, https://www.noticiasagricolas.com.br/ (para notícias), https://www.cepea.esalq.usp.br/br (para duvidas sobre preços brasileiros de alimentos), 
    https://www.canalrural.com.br/ e https://www.agrolink.com.br/. Atenção: você não deve-se apresentar-se (não mande mensagem de "Olá!", "Tudo bem?" e afins) e não deve necessariamente 
    responder o usuário sobre onde se localizar no aplicativo, nem recomendar todos os sites aqui citados. Faça isso somente se for necessário. Atenção: faça uma resposta direta ao ponto e 
    considere as perguntas anteriores do usuário, dadas em: ${previousQuestions}. Caso esteja vazia a Seja direto na sua resposta.lista anterior, significa que essa é sua primeira pergunta. Para evitar a repetição
    de perguntas, segue aqui suas respostas anteriores (busque nunca repetir uma informação já dita): ${previousResponses}. Por fim, busque, se necessário, indicar perguntas comuns sobre 
    sustentabilidade e vida de produção agrícola, indicando soluções sustentáveis de possíveis pragas comuns do Brasil.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${LLAMA_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 500,
          top_p: 1,
        })
      });

      if (!response.ok) {
        throw new Error(`Eita! Parece que houve um problema. Certifique-se de que você está conectado à internet! Aqui vai uma mensagem para os desenvolvedores: HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const botMessage = { role: 'assistant', content: data.choices[0].message.content };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        setBotResponses([...botResponses, data.choices[0].message.content]); 
      } else {
        const botMessage = { role: 'assistant', content: "Desculpe, não consegui gerar uma resposta. Certifique-se que está conectado à internet. Reinicie o aplicativo se necessário" };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }
    } catch (error) {
      const botMessage = { role: 'assistant', content: "Houve um erro ao enviar a mensagem. Certifique-se que está conectado à internet. Reinicie o aplicativo se necessário." };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={item.role === 'user' ? styles.userMessage : styles.botMessage}>
            {item.role === 'assistant' ? (
              <Markdown style={{ body: styles.markdown }}>{item.content}</Markdown>
            ) : (
              <Text style={styles.markdown}>{item.content}</Text>
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={loading} />}
      />
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Digite sua mensagem..."
        placeholderTextColor="#808080"
      />
      <Button title="Enviar" onPress={sendMessage} color="#10A37F" />
      {loading && <ActivityIndicator size="large" color="#10A37F" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
  },
  input: {
    borderWidth: 1,
    borderColor: '#40414F',
    backgroundColor: '#40414F',
    color: '#FFF',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E5F74',
    color: '#FFF',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    maxWidth: '75%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#444654',
    color: '#FFF',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    maxWidth: '75%',
  },
  markdown: {
    color: '#FFF',
  },
});
