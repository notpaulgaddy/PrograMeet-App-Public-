import React from "react";
import {
	StyleSheet,
	Text,
	Dimensions,
	TextInput,
	SafeAreaView,
	Image,
	View,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { DARKGREY, LIGHTGREY, NAVYBLUE, WHITE } from "../config/Constants";
import moment from "moment";
import {
	Avatar,
	IconButton,
	List,
	Paragraph,
	Badge,
	Surface,
} from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as RootNavigation from "../helpers/RootNavigation";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { database, db } from "../config/firebase";
import { useList, useObject } from "react-firebase-hooks/database";
import {
	query,
	collection,
	getFirestore,
	orderBy,
	where,
	doc,
} from "firebase/firestore";
import { getDatabase, ref } from "firebase/database";

export const NotificationChats = ({ user }) => {
	const [messages, loading, error] = useList(
		ref(database, `messages`)
	);

	let notCount = 0;

	if (!loading) {
		messages.map((snapshots) => {
			snapshots.forEach((snap) => {
				if (!snap.val().isRead && snap.val().receiver === user.userId) {
					notCount = notCount + 1;
				}
			});
		});
	}

	const [userData, fetching, fetcherror] = useDocument(
		doc(db, "userInfo", `${user.userId}`),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	if (fetching) {
		return <></>;
	}

	return (
		<TouchableOpacity
			style={{
				position: "relative",
			}}
			onPress={() => {
				RootNavigation.navigate("Chat", {
					friends: userData.data().friends,
				});
			}}
		>
			<Ionicons name="chatbox-ellipses-outline" size={25} color="white" />
			<Badge
				size={15}
				style={{
					backgroundColor: WHITE,
					position: "absolute",
				}}
			>
				{notCount}
			</Badge>
		</TouchableOpacity>
	);
};
