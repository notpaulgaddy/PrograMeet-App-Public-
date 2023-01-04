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
} from "react-native";

import { Card, Divider, Paragraph, Title } from "react-native-paper";
import { DARKGREY, LIGHTGREY, NAVYBLUE, WHITE } from "../../config/Constants";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  doc,
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  query,
  getDocs,
  orderBy,
  onSnapshot,
  getDoc,
  where,
} from "firebase/firestore";

import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../config/firebase";
import Placeholder from "../../components/Placeholder";

const Projects = ({ friend, canModify }) => {
  const currentUser = useSelector((state) => state.user);
  const [fireVal, loading, storeError] = useCollection(
    query(
      collection(db, "projects"),
      where("uid", "==", canModify ? currentUser.user.userId : friend.userId)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  if (loading) {
    return <Placeholder />;
  }
  return (
    <ScrollView style={styles.container}>
      <View>
        {fireVal.docs.map((snap, i) => {
          return (
            <Card
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
              key={i}
            >
              <Card.Title title={snap.data().title} />
              <Card.Content>
                <View
                  style={{
                    marginBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 13,
                      color: NAVYBLUE,
                    }}
                  >
                    Why did you create the project?
                  </Text>
                  <Paragraph>{snap.data().why_project}</Paragraph>
                </View>
                <Divider />
                <View
                  style={{
                    marginBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 13,
                      color: NAVYBLUE,
                    }}
                  >
                    What were your biggest challenges?
                  </Text>
                  <Paragraph>{snap.data().challenges}</Paragraph>
                </View>
                <Divider />
                <View
                  style={{
                    marginBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 13,
                      color: NAVYBLUE,
                    }}
                  >
                    What technologies did you use?
                  </Text>
                  <Paragraph>{snap.data().technologies}</Paragraph>
                </View>
                <Divider />
                <View
                  style={{
                    marginBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 13,
                      color: NAVYBLUE,
                    }}
                  >
                    What was your role in the project?
                  </Text>
                  <Paragraph>{snap.data().role}</Paragraph>
                </View>
                <Divider />
                <View
                  style={{
                    marginBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 13,
                      color: NAVYBLUE,
                    }}
                  >
                    How long did take to build the project?
                  </Text>
                  <Paragraph>{snap.data().duration}</Paragraph>
                </View>
              </Card.Content>
              <Card.Actions></Card.Actions>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Projects;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    backgroundColor: LIGHTGREY,
    marginTop: 10,
    padding: 5,
  },
});
