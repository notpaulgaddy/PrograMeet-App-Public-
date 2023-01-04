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
	Divider,
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
import ChatBubbleLeft from "./ChatBubbleLeft";
import ChatBubbleRight from "./ChatBubbleRight";
import moment from "moment";
import { useRoute } from "@react-navigation/native";

const MessageBox = ({ chatId, user }) => {
	const [msgDATA, setMsgData] = React.useState({});
	const [messages, msgLoading, loadinError] = useList(
		ref(database, `messages/${chatId}`)
	);
	const currentUser = useSelector((state) => state.user);
	const nav = useRoute();
	useEffect(() => {
		let msgObj = {};
	}, []);

	let dat = "";
	let senderMsgKeys = [];
	let receiverMsgKeys = [];
	let dateArr = [];
	if (msgLoading) {
		return <Placeholder />;
	}
	return messages.map((snap, i) => {
		let dt = moment(snap.val().createdAt).format("L");

		if (dat !== dt) {
			dat = dt;
			dateArr.push(dat);
			return dateArr.map((msgDate) => {
				dateArr = [];
				return (
					<>
						<List.Subheader
							style={{
								alignSelf: "center",
								fontWeight: "bold",
								fontSize: 15,
							}}
						>
							{msgDate === moment(Date.now()).format("L") ? "Today" : ""}
							{msgDate === moment(Date.now()).subtract(1, "days").format("L")
								? "Yesterday"
								: ""}
							{msgDate === moment(Date.now()).subtract(2, "days").format("L")
								? moment(snap.val().createdAt).format("dddd")
								: ""}
							{msgDate !== moment(Date.now()).subtract(2, "days").format("L") &&
								msgDate !== moment(Date.now()).subtract(1, "days").format("L") &&
								msgDate !== moment(Date.now()).format("L")
								? moment(snap.val().createdAt).format("L")
								: ""}
						</List.Subheader>
						<Divider />
						{messages.map((snap, i) => {
							let dt2 = moment(snap.val().createdAt).format("L");
							if (
								snap.val().receiver === currentUser.user.userId &&
								snap.val().uid === nav.params.uid &&
								dt2 === msgDate
							) {
								receiverMsgKeys.push(snap.key);
								senderMsgKeys = [];
								return (
									<View
										key={i}
										style={{
											marginVertical: 10,
											minHeight: 60,
											flexDirection: "row",
											alignItems: "baseline",
										}}
									>
										<ChatBubbleLeft
											msgKeysArr={receiverMsgKeys}
											msgKey={snap.key}
											msgObj={snap.val()}
											user={user}
										/>
									</View>
								);
							} else if (
								snap.val().uid === currentUser.user.userId &&
								snap.val().receiver === nav.params.uid &&
								dt2 === msgDate
							) {
								senderMsgKeys.push(snap.key);
								receiverMsgKeys = [];
								return (
									<View key={i}>
										<View
											style={{
												marginVertical: 10,
												justifyContent: "flex-end",
												flexDirection: "row",
												alignItems: "baseline",
												minHeight: 60,
											}}
										>
											<ChatBubbleRight
												itemkey={i}
												tracker={0}
												user={currentUser.user}
												msgObj={snap.val()}
												receiver={nav.params.uid}
												msgKeysArr={senderMsgKeys}
												msgKey={snap.key}
											/>
										</View>
									</View>
								);
							}
						})}
					</>
				);
			});
		}
	});
};

export default MessageBox;