import React, { useContext } from "react";
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
import PostCard from "../../components/PostCard";
import RootNavigation from "../../helpers/RootNavigation";
import AppContext from "../../store/AppContext";
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
import { IconButton, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
const Posts = ({ friend, canModify, navigation }) => {
	console.log(navigation);
	const context = useContext(AppContext);
	const currentUser = useSelector((state) => state.user);
	const [fireVal, loading, storeError] = useCollection(
		query(
			collection(db, "posts"),
			where("uid", "==", canModify ? currentUser.user.userId : friend.userId)
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const { colors } = useTheme();
	return (
		<ScrollView>
			<View style={{ marginTop: 10 }}>
				{loading ? (
					<Placeholder />
				) : (
					fireVal.docs.map((snap, i) => {
						return (
							<PostCard
								key={i}
								postKey={snap.id}
								post={snap.data()}
								theme={colors}
								navigation={navigation}
								user={currentUser.user}
								canModify={false}
							/>
						);
					})
				)}
			</View>
		</ScrollView>
	);
};

export default Posts;
