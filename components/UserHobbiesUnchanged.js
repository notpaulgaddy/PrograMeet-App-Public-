import { doc, getFirestore } from "firebase/firestore";
import React from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { Text, View } from "react-native";
import { db } from "../config/firebase";
import {
	ActivityIndicator,
	Avatar,
	Button,
	Chip,
	TextInput as MaterialInput,
} from "react-native-paper";
import User from "../services/User";

const UserHobbiesUnchanged = ({ uid }) => {
	const [user, fetching, error] = useDocument(
		doc(db, "userInfo", `${uid}`),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (fetching) {
		return <></>;
	}
	const remHobby = async (hobb) => {
		await User.updateHobbies(hobb, user.data().userId, "remove");
	};

	return user.data().hobbies.map((hobby) => {
		return (
			<Chip
				style={{
					marginLeft: 3,
					marginTop: 10,
				}}
			>
				{hobby}
			</Chip>
		);
	});
};

export default UserHobbiesUnchanged;
