import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function FavoritesScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [apelidos, setApelidos] = useState({});

  const carregar = async () => {
    const snap = await getDocs(collection(db, "favoritos"));

    const lista = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setFavoritos(lista);
  };

  useEffect(() => {
    carregar();
  }, []);

  const deletar = async (id) => {
    await deleteDoc(doc(db, "favoritos", id));
    carregar();
  };

  const atualizarApelido = async (id) => {
    try {
      await updateDoc(doc(db, "favoritos", id), {
        apelido: apelidos[id] || "",
      });

      alert("Apelido atualizado!");
      carregar();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>⭐ Favoritos</Text>

      <TouchableOpacity
        style={styles.btnVoltar}
        onPress={() => navigation.navigate("Pokedex")}
      >
        <Text style={styles.txtVoltar}>⬅ Voltar para a Pokédex</Text>
      </TouchableOpacity>

      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagem }} style={styles.imagem} />

            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.id}>ID: {item.idPokemon}</Text>
            {item.apelido ? (
              <Text style={styles.apelido}>
                ⭐ Apelido: {item.apelido}
              </Text>
            ) : null}

            <TextInput
              placeholder="Digite um apelido"
              value={apelidos[item.id] || ""}
              onChangeText={(texto) =>
                setApelidos({
                  ...apelidos,
                  [item.id]: texto,
                })
              }
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.btnSalvar}
              onPress={() => atualizarApelido(item.id)}
            >
              <Text style={styles.txtSalvar}>Salvar Apelido</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnRemover}
              onPress={() => deletar(item.id)}
            >
              <Text style={styles.txtRemover}>🗑 Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f0bc",
  },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  btnVoltar: {
    backgroundColor: "#c25843",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    alignSelf: "flex-start",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  txtVoltar: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
    elevation: 4,
  },

  imagem: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },

  nome: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginBottom: 5,
  },

  id: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    fontWeight: "bold",
  },

  apelido: {
    fontSize: 15,
    color: "#555",
    marginTop: 5,
    marginBottom: 10,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 2,
    borderColor: "#c25843",
    backgroundColor: "#fff",
    width: 190,
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
  },

  btnSalvar: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 10,
  },

  txtSalvar: {
    color: "#fff",
    fontWeight: "bold",
  },

  btnRemover: {
    backgroundColor: "#f4433644",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 5,
  },

  txtRemover: {
    color: "#f62626",
    fontWeight: "bold",
    fontSize: 16,
  },
});