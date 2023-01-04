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

const UserInterestsUnchanged = ({ uid }) => {
	const [user, fetching, error] = useDocument(
		doc(db, "userInfo", `${uid}`),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (fetching) {
		return <></>;
	}
	console.log(user.data());

	return (
		user.data().interests &&
		user.data().interests.map((int, i) => {
			return (
				<Chip
					key={`${int}-${i}`}
					style={{
						marginLeft: 3,
						marginTop: 10,
					}}
				>
					{int}
				</Chip>
			);
		})
	);
};

export default UserInterestsUnchanged;
