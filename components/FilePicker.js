import React from "react";
import * as DocumentPicker from "expo-document-picker";

import {
  Avatar,
  IconButton,
  List,
  Paragraph,
  Surface,
} from "react-native-paper";
import {
  StyleSheet,
  Text,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Button,
  BackHandler,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NAVYBLUE } from "../config/Constants";

const FilePicker = () => {
  const pickAttachment = () => {
    DocumentPicker.getDocumentAsync()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <TouchableOpacity onPress={pickAttachment}>
      <Ionicons name="attach" size={30} color={NAVYBLUE} />
    </TouchableOpacity>
  );
};

export default FilePicker;
