import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TextInput, Button, Text, RefreshControl } from 'react-native';

// TODO: Use .env to import 
const LLAMA_KEY = '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';

export default function Chatbot({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    setInput('');
    setLoading(true);

    const prompt = `${input}`;

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const botMessage = { role: 'assistant', content: data.choices[0].message.content };
        setMessages(prevMessages => [...prevMessages, newMessage, botMessage]);
      } else {
        const botMessage = { role: 'assistant', content: "Desculpe, não consegui gerar uma resposta." };
        setMessages(prevMessages => [...prevMessages, newMessage, botMessage]);
      }
    } catch (error) {
      const botMessage = { role: 'assistant', content: "Houve um erro ao enviar a mensagem." };
      setMessages(prevMessages => [...prevMessages, newMessage, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={item.role === 'user' ? styles.userMessage : styles.botMessage}>
            {item.content}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={loading} />}
      />
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Digite sua mensagem..."
      />
      <Button title="Enviar" onPress={sendMessage} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1ffc7',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#c7d3ff',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
});
