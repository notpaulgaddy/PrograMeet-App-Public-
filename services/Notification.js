import {
	addDoc,
	collection,
	deleteDoc,
	doc,
} from "firebase/firestore";
import { db } from "../config/firebase";
class Notification {
	addNotification = async (data, uid, type) => {
		try {
			await addDoc(collection(db, `notifications`), data);
		} catch (error) {
			console.log(error);
		}
	};
	remNotification = async (key) => {
		await deleteDoc(doc(db, "notifications", key));
	};
}
export default new Notification();
