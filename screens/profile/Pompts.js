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
import { Card, Paragraph, Surface, Title } from "react-native-paper";
import { DARKGREY, LIGHTGREY, WHITE } from "../../config/Constants";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

const Prompts = ({ friend, canModify }) => {
  const currentUser = useSelector((state) => state.user);

  return (
    <ScrollView style={styles.container}>
      <View>
        {canModify &&
          currentUser.user &&
          currentUser.user.prompts &&
          currentUser.user.prompts.map((pr, i) => {
            return (
              <Surface
                key={i}
                style={{ marginTop: 10, padding: 10, position: "relative" }}
              >
                <View>
                  <View>
                    <Title
                      style={{
                        fontSize: 15,
                      }}
                    >
                      {pr.title}
                    </Title>
                    <Paragraph>{pr.answer}</Paragraph>
                  </View>
                  <View></View>
                </View>
              </Surface>
            );
          })}

        {!canModify &&
          friend &&
          friend.prompts &&
          friend.prompts.map((pr, i) => {
            return (
              <Surface
                key={i}
                style={{ marginTop: 10, padding: 10, position: "relative" }}
              >
                <View>
                  <View>
                    <Title
                      style={{
                        fontSize: 15,
                      }}
                    >
                      {pr.title}
                    </Title>
                    <Paragraph>{pr.answer}</Paragraph>
                  </View>
                  <View></View>
                </View>
              </Surface>
            );
          })}
      </View>
    </ScrollView>
  );
};

export default Prompts;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    backgroundColor: LIGHTGREY,
    marginTop: 10,
    padding: 5,
  },
});
