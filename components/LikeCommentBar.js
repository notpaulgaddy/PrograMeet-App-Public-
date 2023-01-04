import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MAGENTA } from "../config/Constants";
import { useDispatch, useSelector } from "react-redux";
import { getFirestore, doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../config/firebase";
import Pst from "../services/Post";

import { setModal } from "../store/model";

const LikeCommentBar = ({ isComment, node, postkey }) => {
	const currentUser = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [value, loading, error] = useDocument(
		doc(db, `${node}`, postkey),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	if (loading) {
		return <Text>...</Text>;
	}

	const doLike = async (post, uid, postKy) => {
		if (isComment) {
			await Pst.likeComment(postKy, currentUser.user.userId);
		} else {
			await Pst.like(post, uid, postKy);
		}
	};

	return (
		<View
			style={{
				flex: 1,
				flexDirection: "row",
				marginTop: 17,
			}}
		>
			<View
				style={{
					flex: 1,
					width: "50%",
					justifyContent: "space-evenly",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<TouchableOpacity
					onPress={() => dispatch(setModal(true))}
					style={{
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<View>
						<Ionicons
							color={"gray"}
							style={{
								fontWeight: "700",
							}}
							size={20}
							name="chatbubble-ellipses-outline"
						/>
					</View>
					<View>
						<Text
							style={{
								color: "gray",
								marginLeft: 5,
								fontWeight: "700",
							}}
						>
							{value.data().commentCount}
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						flexDirection: "row",
						alignItems: "center",
					}}
					onPress={() =>
						doLike(value.data().post, currentUser.user.userId, postkey)
					}
				>
					<Ionicons
						color={
							value.data().post &&
								value.data().likes &&
								value.data().likes.includes(currentUser.user.userId)
								? MAGENTA
								: "gray"
						}
						style={{
							fontWeight: "700",
							marginLeft: 5,
						}}
						size={20}
						name={
							value.data().post &&
								value.data().likes &&
								value.data().likes.includes(currentUser.user.userId)
								? "heart"
								: "heart-outline"
						}
					/>
					<Text
						style={{
							fontWeight: "700",
							marginLeft: 5,
							color:
								value.data().post &&
									value.data().likes &&
									value.data().likes.includes(currentUser.user.userId)
									? MAGENTA
									: "gray",
						}}
					>
						{value.data().post && value.data().likes
							? value.data().likes.length
							: "0"}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default LikeCommentBar;
