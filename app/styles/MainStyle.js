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
    width: 200,
    height: 200,
    marginTop: 30,
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
    elevation: 1,
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
    color: "black",
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  text: {
    fontSize: 18,
  },
  link: {
    fontWeight: "bold",
    fontFamily: "Roboto",
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
  submitButton: {
    backgroundColor: "#76c893",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    marginVertical: 20,
    elevation: 2,
  },
  error: {
    fontSize: 14,
    textAlign: "center",
    color: "red",
    width: "80%",
    marginTop: 2,
  },
  roundButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 10,
    marginVertical: 5,
    marginLeft: 10,
    elevation: 2,
    alignSelf: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    maxWidth: 500,
    width: "90%",

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  box: {
    backgroundColor: "powderblue",
    borderRadius: 25,
    padding: 10,
  },
});
