import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageService {
	constructor() {}

	getUserData = async (key) => {
		try {
			const value = await AsyncStorage.getItem(`${key}`);

			if (value !== null) {
				return value;
			}
		} catch (e) {
			// error reading value
		}
	};

	setUserData = async (key, data) => {
		try {
			await AsyncStorage.setItem(key, data);
		} catch (error) {
			console.log(error);
		}
	};

	removeLocalData = async (key) => {
		try {
			await AsyncStorage.clear();
		} catch (error) {}
	};
}

export default new StorageService();
