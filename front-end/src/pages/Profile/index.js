import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import { initializeApp } from 'firebase/app';
import firebaseConfig from "../../firebase/config";
import { GlobalContext } from '../../contexts/GlobalContext';
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  getDoc,
  getDocs
} from "firebase/firestore";

export default function Profile({ navigation }) {
  const { globalEmail } = useContext(GlobalContext);

  const [userData, setUserData] = useState(null);
  const [userData2, setUserData2] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firebaseApp = initializeApp(firebaseConfig);
        const db = getFirestore(firebaseApp);

        // 1) Busca na coleção "users"
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", globalEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Pegue o primeiro doc que corresponde ao e-mail
          const userDocData = querySnapshot.docs[0].data();
          setUserData(userDocData);
        } else {
          setUserData(null);
        }

        // 2) Busca na coleção "propriedades"
        //    Aqui assumimos que o ID do documento é exatamente globalEmail (como mostrado no print)
        const propDocRef = doc(db, "propriedades", globalEmail);
        const propSnapshot = await getDoc(propDocRef);

        if (propSnapshot.exists()) {
          setUserData2(propSnapshot.data());
        } else {
          setUserData2(null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [globalEmail]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10A37F" />
        <Text style={styles.loadingText}>Carregando suas informações...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil do Usuário</Text>
      </View>

      {/* Se não encontrou NADA em ambas as coleções */}
      {!userData && !userData2 && (
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Sistema está fora do ar. </Text>
        </View>
      )}

      {/* Se encontrou algum dado na coleção "users" */}
      {userData && (
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Segue abaixo todas as suas informações do perfil:
          </Text>

          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{userData.name || "Não informado"}</Text>

          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.value}>{userData.email || "Não informado"}</Text>

          {userData.gender && (
            <>
              <Text style={styles.label}>Gênero:</Text>
              <Text style={styles.value}>{userData.gender}</Text>
            </>
          )}

          {userData.age && (
            <>
              <Text style={styles.label}>Idade:</Text>
              <Text style={styles.value}>{userData.age}</Text>
            </>
          )}

          {userData.profile && (
            <>
              <Text style={styles.label}>Perfil:</Text>
              <Text style={styles.value}>{userData.profile}</Text>
            </>
          )}
        </View>
      )}

      {/* Se encontrou dados na coleção "propriedades" */}
      {userData2 && (
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Segue abaixo as informações de sua propriedade:
          </Text>

          {/* Exemplo de como renderizar alguns campos do print que você enviou */}
          <Text style={styles.label}>Água o ano inteiro?</Text>
          <Text style={styles.value}>
            {userData2.aguaAnoInteiro ? "Sim" : "Não"}
          </Text>

          <Text style={styles.label}>Área Rural (ha):</Text>
          <Text style={styles.value}>{userData2.areaRural || "Não informado"}</Text>

          <Text style={styles.label}>Código do Imóvel:</Text>
          <Text style={styles.value}>{userData2.codigoImovel || "Não informado"}</Text>

          {/* Culturas (array) */}
          {userData2.culturas && userData2.culturas.length > 0 && (
            <>
              <Text style={styles.label}>Culturas:</Text>
              <Text style={styles.value}>{userData2.culturas.join(", ")}</Text>
            </>
          )}

          {/* Fonte de Água (array) */}
          {userData2.fonteAgua && userData2.fonteAgua.length > 0 && (
            <>
              <Text style={styles.label}>Fonte de Água:</Text>
              <Text style={styles.value}>{userData2.fonteAgua.join(", ")}</Text>
            </>
          )}

          {/* Fonte de Energia (array) */}
          {userData2.fonteEnergia && userData2.fonteEnergia.length > 0 && (
            <>
              <Text style={styles.label}>Fonte de Energia:</Text>
              <Text style={styles.value}>{userData2.fonteEnergia.join(", ")}</Text>
            </>
          )}

          {/* Gastos */}
          <Text style={styles.label}>Gasto de Água (R$):</Text>
          <Text style={styles.value}>{userData2.gastoAgua || "Não informado"}</Text>

          <Text style={styles.label}>Gasto de Luz (R$):</Text>
          <Text style={styles.value}>{userData2.gastoLuz || "Não informado"}</Text>

          <Text style={styles.label}>Gasto de Combustível (R$):</Text>
          <Text style={styles.value}>{userData2.gastoCombustivel || "Não informado"}</Text>

          {/* Gênero e idade, caso também estejam em 'propriedades' */}
          {userData2.genero && (
            <>
              <Text style={styles.label}>Gênero:</Text>
              <Text style={styles.value}>{userData2.genero}</Text>
            </>
          )}

          {userData2.idade && (
            <>
              <Text style={styles.label}>Idade:</Text>
              <Text style={styles.value}>{userData2.idade}</Text>
            </>
          )}

          {/* Irrigação (boolean) */}
          <Text style={styles.label}>Possui irrigação?</Text>
          <Text style={styles.value}>
            {userData2.irrigacao ? "Sim" : "Não"}
          </Text>

          <Text style={styles.label}>Demanda de Irrigação:</Text>
          <Text style={styles.value}>{userData2.demandaIrrigacao || "Não calculada"} mm/mês</Text>

          <Text style={styles.label}>Índice de Segurança Hídrica:</Text>
          <Text style={styles.value}>{userData2.indiceSegurancaHidrica || "Não calculado"}</Text>

          {userData2.mudancasClimaticas && userData2.mudancasClimaticas.length > 0 && (
            <>
              <Text style={styles.label}>Mudanças Climáticas Percebidas:</Text>
              <Text style={styles.value}>{userData2.mudancasClimaticas.join(", ")}</Text>
            </>
          )}

          {userData2.praticasManejo && userData2.praticasManejo.length > 0 && (
            <>
              <Text style={styles.label}>Práticas de Manejo do Solo:</Text>
              <Text style={styles.value}>{userData2.praticasManejo.join(", ")}</Text>
            </>
          )}

          {userData2.produtos && userData2.produtos.length > 0 && (
            <>
              <Text style={styles.label}>Produtos Derivados e Processados:</Text>
              <Text style={styles.value}>{userData2.produtos.join(", ")}</Text>
            </>
          )}

          {userData2.transporte && userData2.transporte.length > 0 && (
            <>
              <Text style={styles.label}>Meios de Transporte:</Text>
              <Text style={styles.value}>{userData2.transporte.join(", ")}</Text>
            </>
          )}

          <Text style={styles.label}>Frequência de Irrigação:</Text>
          <Text style={styles.value}>{userData2.frequenciaIrrigacao || "Não informado"}</Text>

          <Text style={styles.label}>Volume de Água por Mês (litros):</Text>
          <Text style={styles.value}>{userData2.volumeAguaMes || "Não informado"}</Text>

        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#444654',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  infoSection: {
    padding: 20,
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
  infoText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#10A37F',
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
});
