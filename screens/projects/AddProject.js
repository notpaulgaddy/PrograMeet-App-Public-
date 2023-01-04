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
} from "../../config/Constants";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import ProjectService from "../../services/ProjectService";
import * as RootNavigation from "../../helpers/RootNavigation";

const AddProject = () => {
  const [isSaving, setSaving] = React.useState(false);
  let inputText = React.useRef("");
  const { user } = useSelector((state) => state.user);

  let projObj = {
    title: "",
    why_project: "",
    role: "",
    challenges: "",
    technologies: "",
    duration: "",
    uid: user.userId,
  };
  const setValue = (field, val) => {
    projObj[field] = val;
  };
  const saveProject = async () => {
    console.log(projObj);
    if (
      projObj.title === "" ||
      projObj.why_project === "" ||
      projObj.role === "" ||
      projObj.challenges === "" ||
      projObj.technologies === "" ||
      projObj.duration === ""
    ) {
      Toast.show("Please add all required field", {
        duration: Toast.durations.LONG,
      });
      return;
    }
    ProjectService.add(projObj)
      .then((snap) => {
        Toast.show("Project Added", {
          duration: Toast.durations.LONG,
        });

        RootNavigation.navigationRef.current.goBack();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <ScrollView>
            <View style={styles.formArea}>
              <View
                style={{
                  marginBottom: 20,
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    marginBottom: 10,
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  Title *
                </Text>
                <View>
                  <TextInput
                    placeholder="Project Title"
                    onChangeText={(n) => setValue("title", n)}
                    placeholderTextColor="#003f5c"
                  />
                </View>
              </View>

              <View
                style={{
                  marginBottom: 20,
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    marginBottom: 10,
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  Why did you create the project? *
                </Text>
                <View>
                  <TextInput
                    placeholder="Why did you create project"
                    onChangeText={(n) => setValue("why_project", n)}
                    placeholderTextColor="#003f5c"
                  />
                </View>
              </View>

              <View
                style={{
                  marginBottom: 20,
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    marginBottom: 10,
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  What were your biggest challenges? *
                </Text>
                <View>
                  <TextInput
                    multiline={true}
                    numberOfLines={3}
                    placeholder="Challenges"
                    onChangeText={(n) => setValue("challenges", n)}
                    placeholderTextColor="#003f5c"
                  />
                </View>
              </View>

              <View
                style={{
                  marginBottom: 20,
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    marginBottom: 10,
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  What technologies did you use? *
                </Text>
                <View>
                  <TextInput
                    multiline={true}
                    numberOfLines={3}
                    placeholder="Technologies"
                    onChangeText={(n) => setValue("technologies", n)}
                    placeholderTextColor="#003f5c"
                  />
                </View>
              </View>

              <View
                style={{
                  marginBottom: 20,
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    marginBottom: 10,
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  What was your role in the project? *
                </Text>
                <View>
                  <TextInput
                    multiline={true}
                    numberOfLines={3}
                    placeholder="Your role"
                    onChangeText={(n) => setValue("role", n)}
                    placeholderTextColor="#003f5c"
                  />
                </View>
              </View>

              <View
                style={{
                  marginBottom: 20,
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    marginBottom: 10,
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  How long did take to build the project? *
                </Text>
                <View>
                  <TextInput
                    multiline={true}
                    numberOfLines={3}
                    placeholder="Duration"
                    onChangeText={(n) => setValue("duration", n)}
                    placeholderTextColor="#003f5c"
                  />
                </View>
              </View>

              <View>
                <TouchableOpacity
                  onPress={saveProject}
                  style={{
                    padding: 10,
                    borderRadius: 25,
                    marginBottom: 15,
                    backgroundColor: NAVYBLUE,
                  }}
                >
                  <Text
                    style={{
                      color: LIGHTGREY,
                      alignSelf: "center",
                    }}
                  >
                    Add Project
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
    shadowColor: BLACK,
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
  formArea: {
    marginTop: 15,
  },

  textInputArea: {
    backgroundColor: WHITE,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    marginTop: 10,
  },
  iconArea: {
    width: "10%",
    paddingLeft: 10,
  },
  inputArea: {
    backgroundColor: "white",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  placeholderText: {
    marginTop: 25,
    marginRight: 30,
  },
});

export default AddProject;
