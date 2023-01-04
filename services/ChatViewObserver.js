import { database, db } from "../config/firebase";
import { ref, child, set, get, update } from "firebase/database";
import {
	collection,
	query,
	where,
	getDocs,
	updateDoc,
	doc,
} from "firebase/firestore";
class ChatViewObserver {
	#db;
	#storeDb;
	constructor() {
		this.#db = database;
		this.#storeDb = db;
	}
	onChatView = async (uid, receiverId) => {
		const usersRef = ref(this.#db, `chatView/${uid}/${receiverId}`);
		await set(usersRef, "active");
		const q = query(
			query(
				collection(db, "messages"),
				where("receiver", "==", uid),
				where("uid", "==", receiverId),
				where("isRead", "==", false)
			)
		);
		getDocs(q).then((snapshot) => {
			snapshot.forEach((snap) => {
				const msgRef = doc(this.#storeDb, "messages", snap.id);
				updateDoc(msgRef, {
					isRead: true,
				});
			});
		});
	};
	offChatView = (uid, receiverId) => {
		const usersRef = ref(this.#db, `chatView/${uid}/${receiverId}`);
		set(usersRef, null);
	};
	setRecentChatRead = (chatKey) => {
		const msgRef = ref(this.#db, `recentMessages/${chatKey}`);
		update(msgRef, {
			isRead: true,
		});
	};
	setRead = (chatKey) => {
		const messagesRef = ref(this.#db);
		get(child(messagesRef, `messages/${chatKey}`)).then((snaps) => {
			if (snaps.exists()) {
				snaps.forEach((snap) => {
					if (!snap.val().isRead) {
						const msgRef = ref(this.#db, `messages/${chatKey}/${snap.key}`);
						update(msgRef, {
							isRead: true,
						});
					}
				});
			}
		});
	};
}
export default new ChatViewObserver();
