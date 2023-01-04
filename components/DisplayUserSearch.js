import React, { useEffect } from "react";
import * as RootNavigation from "../helpers/RootNavigation";
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
import { Avatar, List } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../config/firebase";

const DisplayUserSearch = ({ data }) => {
  const loggedUser = useSelector((state) => state.user);
  const viewProfile = (uid) => {
    RootNavigation.navigate("ViewProfile", {
      uid,
    });
  };

  return data.map((snap) => {
    if (loggedUser.user.userId !== snap.data().userId) {
      return (
        <TouchableOpacity onPress={() => viewProfile(snap.data().userId)}>
          <List.Item
            left={() => {
              return (
                <Avatar.Image
                  source={{
                    uri: snap.data().avatar,
                  }}
                />
              );
            }}
            title={snap.data().name}
            description={snap.data().username}
          ></List.Item>
        </TouchableOpacity>
      );
    } else {
      return <></>;
    }
  });
};

// const DisplayUserSearch = () =>  {
//     const { user } = useSelector((state) => state.user);
//     const [fireVal, loading, storeError] = useCollection(
//     query(
// collection(db, "userInfo"),
//       orderBy("name")
//     ),
//     {
//       snapshotListenOptions: { includeMetadataChanges: true },
//     }
//   );

//     return(
//         <View style={styles.userBox}>
//             <Image style={styles.pfp} source = {{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4fb_b8q2uZo4Le72K8AcC1M-MK9wIY7LtXEM6kNaXcH5rgeD6OFOuGrByoQ&s'}}/>
//             <View style={styles.rightText}>
//                 <Text style={styles.name}> Polo G</Text>
//                 <Text style={styles.username}> </Text>
//             </View>+-
//         </View>
//     )
// }

const styles = StyleSheet.create({
  userBox: {
    height: 120,
    marginTop: 20,
    flexDirection: "row",
  },
  pfp: {
    height: 53,
    width: 53,
  },
  name: {
    fontWeight: "bold",
  },
  username: {
    paddingTop: 18,
  },
  rightText: {
    marginRight: 20,
  },
});

export default DisplayUserSearch;
