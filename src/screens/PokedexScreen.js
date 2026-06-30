import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
} from "react-native";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function PokedexScreen({ navigation }) {
  const [pokemon, setPokemon] = useState(null);
  const [id, setId] = useState(1);
  const [nomeBusca, setNomeBusca] = useState("");

  const coresTipos = {
    fire: "#EE8130",
    water: "#6390F0",
    grass: "#7AC74C",
    electric: "#F7D02C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
    normal: "#A8A77A",
  };

  const escala = useRef(new Animated.Value(0.7)).current;

  const fetchPokemon = async (busca) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${busca}`
      );
      const data = await response.json();

      setPokemon({
        id: data.id,
        nome: data.name,
        imagem: data.sprites.front_default,
        tipo1: data.types[0]?.type.name,
        tipo2: data.types[1]?.type.name,
      });

      escala.setValue(0.7);

      Animated.spring(escala, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPokemon(id);
  }, [id]);

  const buscarPorNome = () => {
    if (nomeBusca.trim()) {
      fetchPokemon(nomeBusca.toLowerCase());
    }
  };

  const favoritarPokemon = async () => {
    if (!pokemon) return;

    try {
      await addDoc(collection(db, "favoritos"), {
        idPokemon: pokemon.id,
        nome: pokemon.nome,
        imagem: pokemon.imagem,
        tipo1: pokemon.tipo1,
        tipo2: pokemon.tipo2 || "",
      });

      alert("Salvo nos favoritos!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Pokédex</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome ou ID do Pokémon "
        value={nomeBusca}
        onChangeText={setNomeBusca}
      />

      <TouchableOpacity style={styles.btn} onPress={buscarPorNome}>
        <Text style={styles.txtBtn}>Buscar 🔍</Text>
      </TouchableOpacity>

      {pokemon?.imagem && (
        <Animated.Image
          source={{ uri: pokemon.imagem }}
          style={[
            styles.img,
            {
              transform: [{ scale: escala }],
            },
          ]}
        />
      )}

      <TouchableOpacity style={styles.btn} onPress={favoritarPokemon}>
        <Text style={styles.txtBtn}>Favoritar ❤️</Text>
      </TouchableOpacity>

      <Text style={styles.id}>ID: {pokemon?.id}</Text>
      <Text style={styles.nome}>{pokemon?.nome}</Text>

      <View style={styles.tipos}>
        <Text
          style={[
            styles.tipo,
            { backgroundColor: coresTipos[pokemon?.tipo1] },
          ]}
        >
          {pokemon?.tipo1}
        </Text>

        {pokemon?.tipo2 && (
          <Text
            style={[
              styles.tipo,
              { backgroundColor: coresTipos[pokemon?.tipo2] },
            ]}
          >
            {pokemon?.tipo2}
          </Text>
        )}
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            setId((p) => Math.max(1, p - 1))
          }
        >
          <Text style={styles.txtBtn}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => setId(1)}>
          <Text style={styles.txtBtn}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => setId((p) => p + 1)}>
          <Text style={styles.txtBtn}>Próximo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.center}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Favoritos")}
        >
          <Text style={styles.txtBtn}>⭐ Favoritos ⭐</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f2f0bc",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 2,
    borderColor: "#c25843",
    backgroundColor: "#ffffff65",
    width: "80%",
    padding: 8,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },

  btn: {
    minWidth: 75,
    backgroundColor: "#c24343cf",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginVertical: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  txtBtn: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  img: {
    width: 180,
    height: 180,
    marginVertical: 10,
  },

  nome: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },

  id: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10,
    color: "#763b3b",
  },

  tipos: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginTop: 10,
  },

  tipo: {
    color: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 15,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginHorizontal: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 15,
  },
});