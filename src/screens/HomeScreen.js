import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex App 🔥</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Pokedex")}
      >
        <Text style={styles.txt}>Ir para Pokédex</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Favoritos")}
      >
        <Text style={styles.txt}>⭐ Favoritos ⭐</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f0bc",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#c24343cf",
    padding: 12,
    margin: 10,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
  },
  txt: {
    color: "#fff",
    fontWeight: "bold",
  },
});