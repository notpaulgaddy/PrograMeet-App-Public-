import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";
class FileHandler {
	#storage;
	constructor() {
		this.#storage = storage;
	}
	uploadAudio = async (uri) => {
		const storageRef = ref(this.#storage, `Audio/${Date.now()}`);
		return uploadBytes(storageRef, await this.createBlobUri(uri));
	};
	uploadFile = async (uri) => {
		const storageRef = ref(this.#storage, `Attachments/${Date.now()}`);
		return uploadBytes(storageRef, await this.createBlobUri(uri));
	};
	createBlobUri = async (uri) => {
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function () {
				reject(new TypeError("Network request failed"));
			};
			xhr.responseType = "blob";
			xhr.open("GET", uri, true);
			xhr.send(null);
		});
		return blob;
	};
}
export default new FileHandler();
