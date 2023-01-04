import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import {
	Avatar,
	Button,
	Card,
	Title,
	Paragraph,
	ActivityIndicator,
	Surface,
	Badge,
} from "react-native-paper";
import { List } from "react-native-paper";
import { useList } from "react-firebase-hooks/database";
import { ref, getDatabase } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../config/firebase";
import Placeholder from "./Placeholder";
import * as RootNavigation from "../helpers/RootNavigation";
import OnlineIndicator from "./OnlineIndicator";
import { FormatTime } from "../helpers/FormatTime";
import moment from "moment";
import UnreadIndicator from "./UnreadIndicator";
let msgArr = [];
const ChatLog2 = ({ friends }) => {
	const { user } = useSelector((state) => state.user);
	const [snapshots, loading, error] = useList(
		ref(database, "recentMessages")
	);

	let fArr = [];
	friends.map((f) => {
		fArr.push(f.data());
	});

	if (!loading) {
		msgArr = [];
		msgArr = snapshots.filter(
			(snap) =>
				(snap.val().receiver === user.userId &&
					user.friends.includes(snap.val().uid)) ||
				(snap.val().uid === user.userId &&
					user.friends.includes(snap.val().receiver))
		);
	}

	return msgArr
		.sort(function (a, b) {
			return b.val().createdAt - a.val().createdAt;
		})
		.map((snp, i) => {
			let friend = fArr.filter(
				(u) =>
					u.userId ===
					(snp.val().receiver === user.userId
						? snp.val().uid
						: snp.val().receiver)
			);
			let unreadMsgCount = msgArr.filter(
				(item) => !item.val().isRead && item.val().receiver === user.userId
			);

			return (
				friend.length > 0 && (
					<Surface
						key={i}
						style={{
							elevation: 2,
							marginTop: 10,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								RootNavigation.navigate("ChatScreen", {
									uid:
										snp.val().receiver === user.userId
											? snp.val().uid
											: snp.val().receiver,
									chatKey: snp.key,
								});
							}}
						>
							<List.Item
								right={() => {
									return (
										<View
											style={{
												alignItems: "center",
												flex: 1,
												justifyContent: "flex-end",
												flexDirection: "row",
											}}
										>
											<View>
												<UnreadIndicator chatId={snp.key} />

												<View style={{ marginRight: 30 }}>
													<Text>
														{FormatTime(moment(snp.val().createdAt).fromNow())} ago
													</Text>
												</View>
											</View>
										</View>
									);
								}}
								left={() => {
									return (
										<>
											<Avatar.Image
												source={{
													uri: friend[0].avatar,
												}}
											/>
											<OnlineIndicator receiver={friend[0].userId} />
										</>
									);
								}}
								title={friend[0].name}
								// description={
								//   snp.val().type == "audio" ? "Voice note" : snp.val().message
								// }
								titleStyle={{
									fontWeight:
										!snp.val().isRead && snp.val().receiver === user.userId
											? "bold"
											: "normal",
								}}
								descriptionStyle={{
									fontWeight:
										!snp.val().isRead && snp.val().receiver === user.userId
											? "bold"
											: "normal",
								}}
							/>
						</TouchableOpacity>
					</Surface>
				)
			);
		});
};

export default ChatLog2;
