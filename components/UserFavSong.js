import { doc, getFirestore } from "firebase/firestore";
import React from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { View } from "react-native";
import { db } from "../config/firebase";
import {
	ActivityIndicator,
	Avatar,
	Button,
	Chip,
	TextInput as MaterialInput,
} from "react-native-paper";

const UserFavSong = ({ uid }) => {
	const [user, fetching, error] = useDocument(
		doc(db, "userInfo", `${uid}`),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (fetching) {
		return <></>;
	}

	// if (user.data().favSong.length === 0 || user.data().favSong.length === null) {
	// 	return <></>;
	// } else {
	if (user.data().favSong != null) {
		return (
			<Chip
				style={{
					marginLeft: 3,
					marginTop: 5,
				}}
				icon={() => (
					<Avatar.Image
						size={35}
						source={{
							uri: user.data().favSong.cover,
						}}
					/>
				)}
			>
				{user.data().favSong.name}
			</Chip>
		);
	} else {
		return <></>;
	}
	//}
};

export default UserFavSong;
