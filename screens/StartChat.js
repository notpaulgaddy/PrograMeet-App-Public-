import React, { useContext, useState } from "react";

import {
	StyleSheet,
	Text,
	Dimensions,
	TextInput,
	SafeAreaView,
	Image,
	FlatList,
	TouchableOpacity,
	View,
	ScrollView,
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
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Avatar, Button, List, Surface } from "react-native-paper";
import { useCollection } from "react-firebase-hooks/firestore";
import { getFirestore, query, where, collection } from "firebase/firestore";
import User from "../services/User";
import AppContext from "../store/AppContext";
import * as RootNavigation from "../helpers/RootNavigation";
import { database, db } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useList } from "react-firebase-hooks/database";
import { ref, getDatabase } from "firebase/database";
const StartChat = ({ navigation }) => {
	const ctxt = useContext(AppContext);
	const [friends, setFriends] = useState([]);
	const currentUser = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [value, loading, error] = useCollection(
		query(
			collection(db, "userInfo"),
			where(
				"userId",
				"in",
				currentUser.user.friends.length > 0
					? currentUser.user.friends
					: [currentUser.user.userId]
			)
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const [messages, msgLoading, loadinError] = useList(
		ref(database, `recentMessages`)
	);

	useFocusEffect(
		React.useCallback(() => {
			navigation.setOptions({
				title: `Start Conversation`,
			});
		})
	);
	const startChat = (uid) => {
		if (!msgLoading) {
			let msgs = messages.filter(
				(snap) =>
					(snap.val().receiver === currentUser.user.userId &&
						snap.val().uid === uid) ||
					(snap.val().uid === currentUser.user.userId &&
						snap.val().receiver === uid)
			);
			msgs.forEach((snp) => {
				if (msgs.length === 1) {
					console.log("chatkey ", snp.key);
					RootNavigation.navigate("ChatScreen", {
						uid,
						chatKey: snp.key,
					});
				}
			});
			if (msgs.length === 0) {
				RootNavigation.navigate("ChatScreen", {
					uid,
					chatKey: undefined,
				});
			}
		}
	};

	const renderItem = ({ item }) => {
		{
			return (
				<Surface
					style={{
						marginTop: 5,
					}}
				>
					<TouchableOpacity onPress={() => startChat(item.data().userId)}>
						<List.Section>
							<List.Item
								title={`${item.data().name}`}
								left={() => (
									<Avatar.Image
										size={40}
										source={{
											uri: `${item.data().avatar}`,
										}}
									/>
								)}
							/>
						</List.Section>
					</TouchableOpacity>
				</Surface>
			);
		}
	};
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.card}>
				<View style={styles.cardBody}>
					<List.Subheader>Your Friends</List.Subheader>
					{!loading ? (
						<FlatList
							keyExtractor={(item) => item.id}
							data={value.docs}
							renderItem={(item) => renderItem(item)}
						/>
					) : (
						<></>
					)}
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

export default StartChat;
