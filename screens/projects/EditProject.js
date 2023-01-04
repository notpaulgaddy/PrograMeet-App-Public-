import React from "react";

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
import { useNavigation, useRoute } from "@react-navigation/native";
import ProjectService from "../../services/ProjectService";
import Toast from "react-native-root-toast";
import * as RootNavigation from "../../helpers/RootNavigation";
import { useDispatch, useSelector } from "react-redux";

const EditProject = () => {
  const nav = useRoute();
  const [isSaving, setSaving] = React.useState(false);
  const { user } = useSelector((state) => state.user);
  let inputText = "";
  let projObj = {
    title: nav.params.project.title,
    why_project: nav.params.project.why_project,
    role: nav.params.project.role,
    challenges: nav.params.project.challenges,
    technologies: nav.params.project.technologies,
    duration: nav.params.project.duration,
    uid: user.userId,
  };
  const setValue = (field, val) => {
    projObj[field] = val;
  };
  const saveProject = async () => {
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
    setSaving(true);
    ProjectService.update(projObj, nav.params.project.key)
      .then((snap) => {
        setSaving(false);
        Toast.show("Project details updated ", {
          duration: Toast.durations.LONG,
        });
        RootNavigation.navigationRef.current.goBack();
      })
      .catch((error) => {
        setSaving(false);
        console.log(error);
      });
  };

  console.log(nav.params);
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
                  Title
                </Text>
                <View>
                  <TextInput
                    defaultValue={nav.params.project.title}
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
                  Why did you create the project?
                </Text>
                <View>
                  <TextInput
                    defaultValue={nav.params.project.why_project}
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
                  What were your biggest challenges?
                </Text>
                <View>
                  <TextInput
                    multiline={true}
                    numberOfLines={3}
                    defaultValue={nav.params.project.challenges}
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
                  What technologies did you use?
                </Text>
                <View>
                  <TextInput
                    multiline={true}
                    numberOfLines={3}
                    defaultValue={nav.params.project.technologies}
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
                  What was your role in the project?
                </Text>
                <View>
                  <TextInput
                    multiline={true}
                    numberOfLines={3}
                    defaultValue={nav.params.project.role}
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
                  How long did take to build the project? ?
                </Text>
                <View>
                  <TextInput
                    multiline={true}
                    numberOfLines={3}
                    defaultValue={nav.params.project.duration}
                    placeholder="Duration"
                    onChangeText={(n) => setValue("duration", n)}
                    placeholderTextColor="#003f5c"
                  />
                </View>
              </View>

              <View>
                <TouchableOpacity
                  onPress={saveProject}
                  disabled={isSaving}
                  style={{
                    padding: 10,
                    borderRadius: 25,
                    backgroundColor: NAVYBLUE,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: LIGHTGREY,
                      alignSelf: "center",
                    }}
                  >
                    {isSaving ? "Updating..." : "Update Project"}
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
});

export default EditProject;
