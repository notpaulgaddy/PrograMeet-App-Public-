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
	ImageBackground,
	TouchableOpacity,
} from "react-native";
import { LIGHTGREY, NAVYBLUE } from "../config/Constants";
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";
import { Avatar, Paragraph, Surface } from "react-native-paper";

const ChatBubbleRight = ({
	user,
	status,
	msgObj,
	receiver,
	itemkey,
	msgKeysArr,
	msgKey,
}) => {
	const [sound, setSound] = React.useState();
	const msgRef = React.useRef(itemkey);
	let trackArr = [];

	React.useEffect(() => {
		return sound
			? () => {
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	const doPlay = async (url) => {
		const { sound, status } = await Audio.Sound.createAsync({
			uri: url,
		});
		setSound(sound);
		await sound.playAsync();
		console.log("playing");
	};
	return (
		<>
			<Surface
				style={{
					width: "60%",
					backgroundColor: "rgba(255, 255, 255, 0.0)",
				}}
			>
				<View
					style={{
						borderBottomLeftRadius: 15,
						borderTopLeftRadius: 15,
						backgroundColor: "#2EC4B6",
						borderTopRightRadius: 15,
						padding: 15,
					}}
				>
					{msgObj.type === "audio" ? (
						<>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<View>
									<TouchableOpacity
										ref={msgRef}
										onPress={() => doPlay(msgObj.url)}
									>
										<Ionicons name="play" size={30} color={LIGHTGREY} />
									</TouchableOpacity>
								</View>
								<View>
									<TouchableOpacity onPress={() => console.log("pressed")}>
										<Ionicons name="download" size={30} color={LIGHTGREY} />
									</TouchableOpacity>
								</View>
							</View>
						</>
					) : (
						<></>
					)}

					{msgObj.type === "doc" ? (
						<>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<View>
									<TouchableOpacity onPress={() => console.log("pressed")}>
										<Image
											source={{
												uri: msgObj.url,
											}}
											style={{
												minHeight: 200,
												minWidth: 100,
											}}
										/>
									</TouchableOpacity>
								</View>
								<View></View>
							</View>
						</>
					) : (
						<></>
					)}
					{msgObj.message !== "" ? (
						<Paragraph
							style={{
								color: LIGHTGREY,
							}}
						>
							{msgObj.message}
						</Paragraph>
					) : (
						<></>
					)}
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Text>{moment(msgObj.createdAt).format("h:mm a")}</Text>
					<Text
						style={{
							marginLeft: 5,
						}}
					>
						{msgObj.isRead ? (
							<Ionicons
								name="checkmark-done-outline"
								size={25}
								color={NAVYBLUE}
							/>
						) : (
							<Ionicons name="checkmark-outline" size={25} color={NAVYBLUE} />
						)}
					</Text>
				</View>
			</Surface>
			<View style={{}}>
				{msgKeysArr[msgKeysArr.length - 1] === msgKey ? (
					<Avatar.Image
						source={{
							uri: user.avatar,
						}}
						style={{}}
						size={35}
					/>
				) : (
					<View
						style={{
							marginRight: 30,
						}}
					></View>
				)}
			</View>
		</>
	);
};

export default ChatBubbleRight;