import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 50,
    color: "#fb5b5a",
    marginVertical: 30,
    alignSelf: "center",
  },
  form: {
    maxWidth: 300,
    width: "95%",
    marginTop: 15,
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
    padding: 20,
    elevation: 4,
  },
  input: {
    fontSize: 20,
    borderColor: "#707070",
    borderBottomWidth: 1,
    paddingBottom: 1.5,
    marginTop: 25.5,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "white",
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
  },
  text: {
    fontSize: 18,
  },
  link: {
    fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    backgroundColor: "#fff",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  buttonText: {
    letterSpacing: 0.5,
    fontSize: 16,
    color: "#FFFFFF",
  },
  error: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    width: "80%",
  },
  roundButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 10,
    marginBottom: 10,
    marginLeft: 10,
    elevation: 2,
    alignSelf: "center",
  },
});
