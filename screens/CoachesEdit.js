import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  SafeAreaView,
  Image,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  BLACK,
  DARKGREY,
  LIGHTGREY,
  MAGENTA,
  NAVYBLUE,
  WHITE,
} from "../config/Constants";
import * as RootNavigation from "../helpers/RootNavigation";
import { IconButton, List, Surface, useTheme } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import CoachService from "../services/CoachService";
import { useRoute } from "@react-navigation/native";
const CoachesEdit = ({ navigation }) => {
  const [saving, setSaving] = React.useState(false);
  const [image, setImage] = useState(null);
  const { colors } = useTheme();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const route = useRoute();

  let formData = {
    fName: route.params.coach.fName,
    bio: route.params.coach.bio,
    avatar:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.HLOr38Y1RZQoGz-y98QmEQHaHa%26pid%3DApi&f=1",
  };
  const updateCoach = () => {
    console.log(formData);
    if (
      formData.fName === "" ||
      formData.phone_number === "" ||
      formData.bio === ""
    ) {
      displayToast("Ensure required fields are filled");
      return;
    }
    setSaving(true);

    CoachService.update(formData, route.params.coach.coachKey)
      .then((snap) => {
        displayToast("Coach updated");
        navigation.pop();
        setSaving(false);
      })
      .catch((error) => {
        console.log(error);
        setSaving(false);
        displayToast(JSON.stringify(error));
      });
  };

  const getFormData = (val, name) => {
    formData[name] = val;
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!result.cancelled) {
      // setImage(result);
    }
  };

  const displayToast = (msg) => {
    Toast.show(msg, {
      duration: Toast.durations.LONG,
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <ScrollView>
            <Surface
              style={{
                minHeight: 50,
                marginTop: 5,
              }}
            >
              <Text
                style={{ marginTop: 15, fontWeight: "700", color: DARKGREY,paddingLeft: 10, }}
              >
                Coach Name
              </Text>
              <View style={styles.textInputArea}>
              <View style={styles.inputArea}>
              <TextInput
                style={{
                  height: 50,
                  padding: 10,
                }}
                defaultValue={route.params.coach.fName}
                onChangeText={(v) => getFormData(v, "fName")}
                placeholder="Full Names"
              />
              </View>
              </View>
            </Surface>
            <Surface
              style={{
                minHeight: 50,
                marginTop: 5,
              }}
            >
              <Text
                style={{ marginTop: 15, fontWeight: "700", color: DARKGREY,paddingLeft: 10, }}
              >
                Skills
              </Text>
              <View style={styles.textInputArea}>
              <View style={styles.inputArea}>
              <TextInput
                style={{
                  height: 50,
                  padding: 10,
                }}
                defaultValue={route.params.coach.coachSkills}
                onChangeText={(v) => getFormData(v, "coachSkills")}
                placeholder="Skills"
              />
              </View>
              </View>
            </Surface>
            <Surface
              style={{
                minHeight: 50,
                marginTop: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    width: "100%",
                  }}
                >
                  <Text style={{ marginTop: 15, fontWeight: "700", color: DARKGREY,paddingLeft: 10, }}>Bio</Text>
                  <View style={styles.textInputArea}>
                  <View style={styles.inputArea}>
                  <TextInput
                  style={{
                  height: 50,
                  padding: 10,
                }}
                    defaultValue={route.params.coach.bio}
                    multiline={true}
                    numberOfLines={5}
                    onChangeText={(v) => getFormData(v, "bio")}
                    placeholder="Coach bio"
                  />
                  </View>
                  </View>
                </View>
              </View>
            </Surface>
            
            <Surface>
              <TouchableOpacity
                disabled={saving}
                onPress={updateCoach}
                style={{
                  marginTop: 20,
                  backgroundColor: saving ? DARKGREY : MAGENTA,
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 17,
                    color: saving ? WHITE : LIGHTGREY,
                    fontWeight: "bold",
                  }}
                >
                  {saving ? "Submitting..." : "Submit"}
                </Text>
              </TouchableOpacity>
            </Surface>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingBottom: StatusBar.currentHeight,
    backgroundColor: MAGENTA,
  },
   textInputArea: {
    backgroundColor: WHITE,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    marginTop: 10,
  },
 inputArea: {
    backgroundColor: "white",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    borderRadius: 10,
  },
  card: {
    backgroundColor: LIGHTGREY,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  cardBody: {
    marginHorizontal: 10,
    flex: 1,
    height: "100%",
  },
  postCard: {
    height: 100,
    backgroundColor: WHITE,
    marginTop: 15,
    elevation: 5,
    // shadowColor: BLACK,
  },
  postCardFooter: {
    flex: 1,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  postCardFooterRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  profile: {
    flex: 1,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileInner: {
    width: "50%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicInner: {
    width: 100,
    height: 100,
    position: "relative",
  },
});

export default CoachesEdit;