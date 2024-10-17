import React, { useState } from "react";
import { View, ScrollView, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { create_contact } from "../../api/contact";
import Validator from "../../utils/Validator";

const Contact = ({ token, user }) => {
  const [email, setEmail] = useState(token ? user.email : "");
  const [objet, setObjet] = useState("");
  const [message, setMessage] = useState("");
  const [mailMe, setMailMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const Schema = Validator.object().shape({
    email: Validator.string().email().required().label("Adresse Mail"),
    objet: Validator.string().min(3).required().max(50).label("Objet"),
    message: Validator.string().min(10).required().max(255).label("Message"),
  });

  const submit = async () => {
    if (loading) return;

    const data = { email, objet, message, mail_me: mailMe };
    try {
      await Schema.validate(data, { abortEarly: false });
      setErrors({});
      await handleCreateContact(data);
    } catch (ex) {
      const formErrors = {};
      ex.inner.forEach((error) => {
        formErrors[error.path] = error.errors[0];
      });
      setErrors(formErrors);
    }
  };

  const handleCreateContact = async (data) => {
    setLoading(true);
    try {
      const res = await create_contact(data);
      console.log(res);
      Alert.alert("Confirmation", "Votre message a bien été envoyé");
      resetForm();
    } catch ({ error }) {
      if (error) {
        const formErrors = {};
        Object.keys(error).forEach((field) => {
          const err = error[field];
          formErrors[field] = err[0];
        });
        setErrors(formErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setObjet("");
    setMessage("");
    setEmail(token ? user.email : "");
    setMailMe(false);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 10, marginBottom: 10, backgroundColor: "#fff" }}>
        {renderInput("Objet", objet, setObjet, errors.objet)}
        {!token && renderInput("Email", email, setEmail, errors.email)}
        {renderTextArea("Message", message, setMessage, errors.message)}
        {renderCheckbox("Recevoir une copie du mail", mailMe, setMailMe)}
        <DoneButton onPress={submit} loading={loading} />
      </ScrollView>
    </View>
  );
};

const renderInput = (label, value, setValue, errorMessage) => (
  <View style={{ marginVertical: 10 }}>
    <Text style={{ fontSize: 14, color: "#2C9CDB", marginBottom: 5 }}>{label}</Text>
    <TextInput
      style={{
        borderWidth: 1,
        borderColor: "#2C9CDB",
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: "#8E8E8E",
        fontSize: 14,
      }}
      value={value}
      onChangeText={setValue}
      placeholderTextColor="#8E8E8E"
    />
    {errorMessage && <Text style={{ color: "#F00", fontSize: 12 }}>{errorMessage}</Text>}
  </View>
);

const renderTextArea = (label, value, setValue, errorMessage) => (
  <View style={{ marginVertical: 10 }}>
    <Text style={{ fontSize: 14, color: "#2C9CDB", marginBottom: 5 }}>{label}</Text>
    <TextInput
      style={{
        borderWidth: 1,
        borderColor: "#2C9CDB",
        paddingHorizontal: 15,
        paddingVertical: 10,
        height: 140,
        color: "#8E8E8E",
        fontSize: 14,
        textAlignVertical: "top",
      }}
      multiline
      value={value}
      onChangeText={setValue}
      placeholderTextColor="#8E8E8E"
    />
    {errorMessage && <Text style={{ color: "#F00", fontSize: 12 }}>{errorMessage}</Text>}
  </View>
);

const renderCheckbox = (label, value, setValue) => (
  <TouchableOpacity
    style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    onPress={() => setValue(!value)}
  >
    <View
      style={{
        width: 25,
        height: 25,
        borderWidth: 1,
        borderColor: "#49DD7B",
        backgroundColor: value ? "#49DD7B" : "transparent",
        marginRight: 10,
      }}
    />
    <Text style={{ fontSize: 14, color: "#8E8E8E" }}>{label}</Text>
  </TouchableOpacity>
);

const DoneButton = ({ title = "Envoyer", onPress, loading }) => (
  <TouchableOpacity
    style={{
      backgroundColor: "#49DD7B",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 15,
      borderRadius: 5,
    }}
    onPress={onPress}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={{ color: "white", fontWeight: "700", letterSpacing: 2, fontSize: 20 }}>{title}</Text>
    )}
  </TouchableOpacity>
);

const mapState = ({ user }) => ({
  token: user?.token || null,
  user: user?.user,
});

export default connect(mapState, null)(Contact);
