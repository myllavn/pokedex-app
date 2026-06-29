import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from "react-native";
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

  const fetchPokemon = async (busca) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${busca}`
      );
      const data = await response.json();

      const poke = {
        id: data.id,
        nome: data.name,
        imagem: data.sprites.front_default,
        tipo1: data.types[0]?.type.name,
        tipo2: data.types[1]?.type.name,
      };

      setPokemon(poke);
    } catch (error) {
      console.log("Erro ao buscar Pokémon:", error);
    }
  };

  useEffect(() => {
    fetchPokemon(id);
  }, [id]);

  const buscarPorNome = () => {
    if (nomeBusca.trim() !== "") {
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

            alert("Pokémon salvo nos favoritos!");
            } catch (error) {
            console.log(error);
            alert("Erro ao salvar.");
        }
    };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex 🔥</Text>

      {/* BUSCA */}
      <View style={styles.areaBusca}>
        <TextInput
          style={styles.input}
          placeholder="Nome do Pokémon"
          value={nomeBusca}
          onChangeText={setNomeBusca}
        />

        <TouchableOpacity style={styles.btn} onPress={buscarPorNome}>
          <Text style={styles.txtBtn}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* IMAGEM */}
      <View style={styles.areaImagem}>
        {pokemon?.imagem && (
          <Image source={{ uri: pokemon.imagem }} style={styles.imagem} />
        )}
      </View>

      {/* INFO */}
      <Text>ID: {pokemon?.id}</Text>
      <Text style={styles.nome}>
        {pokemon?.nome?.toUpperCase()}
      </Text>

      {/* TIPOS */}
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

      {/* BOTÕES */}
      <View style={styles.areaBtns}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setId((prev) => Math.max(1, prev - 1))}
        >
          <Text style={styles.txtBtn}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => setId(1)}>
          <Text style={styles.txtBtn}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => setId((prev) => prev + 1)}
        >
          <Text style={styles.txtBtn}>Próximo</Text>
        </TouchableOpacity>
      </View>

      {/* NAV */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text>🏠 Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Favoritos")}>
          <Text>⭐ Favoritos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f0bc",
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  areaBusca: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 8,
    width: 180,
    borderRadius: 8,
  },
  btn: {
    backgroundColor: "#c25843",
    padding: 10,
    borderRadius: 10,
  },
  txtBtn: {
    color: "#fff",
    fontWeight: "bold",
  },
  areaImagem: {
    marginVertical: 10,
  },
  imagem: {
    width: 150,
    height: 150,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tipos: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
  },
  tipo: {
    padding: 6,
    borderRadius: 10,
    color: "#fff",
    textTransform: "capitalize",
  },
  areaBtns: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  nav: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
});