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
} from "react-native";
import { DARKGREY, LIGHTGREY, NAVYBLUE, WHITE } from "../config/Constants";
import moment from "moment";
import {
	Avatar,
	IconButton,
	List,
	Paragraph,
	Surface,
} from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";

const ChatBubbleLeft = ({ msgObj, user, msgKeysArr, msgKey }) => {
	const [sound, setSound] = React.useState();
	React.useEffect(() => {
		return sound
			? () => {
					console.log("Unloading Sound");
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
	};
	return (
		<>
			{msgKeysArr[msgKeysArr.length - 1] === msgKey ? (
				<Avatar.Image
					source={{
						uri: user?.avatar,
					}}
					size={35}
				/>
			) : (
				<View
					style={{
						marginLeft: 30,
						justifyContent: "flex-start",
					}}
				></View>
			)}
			<Surface
				style={{
					width: "60%",
					backgroundColor: "rgba(255, 255, 255, 0.0)",
				}}
			>
				<View
					style={{
						borderTopLeftRadius: 15,
						borderBottomRightRadius: 15,
						backgroundColor: "#011627",
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
				</View>
			</Surface>
		</>
	);
};

export default ChatBubbleLeft;