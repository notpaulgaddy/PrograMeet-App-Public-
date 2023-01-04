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
	Alert,
} from "react-native";

import {
	Card,
	Paragraph,
	Button,
	FAB,
	Title,
	Divider,
} from "react-native-paper";
import { DARKGREY, LIGHTGREY, NAVYBLUE, WHITE } from "../../config/Constants";
import { FontAwesome } from "@expo/vector-icons";
import * as RootNavigation from "../../helpers/RootNavigation";
import Toast from "react-native-root-toast";
import ProjectService from "../../services/ProjectService";

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
import { useDispatch, useSelector } from "react-redux";
const EditProjects = () => {
	const currentUser = useSelector((state) => state.user);
	const [fireVal, loading, storeError] = useCollection(
		query(
			collection(db, "projects"),
			where("uid", "==", currentUser.user.userId)
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (loading) {
		return <Placeholder />;
	}

	const doDelete = async (key) => {
		await ProjectService.delete(key);
	};

	return (
		<ScrollView style={styles.container}>
			<View>
				{fireVal.docs.map((snap, i) => {
					return (
						<Card
							style={{
								marginTop: 10,
								marginBottom: 10,
								borderRadius: 20,
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
							<Card.Actions>
								<Button
									onPress={() =>
										RootNavigation.navigate("Edit Project", {
											project: {
												...snap.data(),
												key: snap.id,
											},
										})
									}
								>
									Edit
								</Button>
								<Button
									onPress={() =>
										Alert.alert("Delete ", "Remove this project", [
											{
												text: "Cancel",
												onPress: () => console.log("Cancel Pressed"),
												style: "cancel",
											},
											{ text: "OK", onPress: () => doDelete(snap.id) },
										])
									}
								>
									Delete
								</Button>
							</Card.Actions>
						</Card>
					);
				})}

				<TouchableOpacity
					onPress={() => RootNavigation.navigate("Add Project")}
					style={{
						padding: 10,
						borderRadius: 25,
						backgroundColor: NAVYBLUE,
						marginBottom: 15,
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
		</ScrollView>
	);
};

export default EditProjects;

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 10,
		backgroundColor: LIGHTGREY,
		marginTop: 10,
		padding: 5,
		flex: 1,
	},
	fab: {
		position: "absolute",
		margin: 16,
		right: 0,
		bottom: 0,
	},
});
