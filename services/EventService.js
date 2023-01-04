import {
	doc,
	query,
	getDocs,
	collection,
	setDoc,
	getFirestore,
	addDoc,
	deleteDoc,
	orderBy,
	startAt,
	endAt,
} from "firebase/firestore";
import { db } from "../config/firebase";
class EventService {
	create = async (event) => {
		event.createdAt = Date.now();
		return await addDoc(collection(db, "events"), event);
	};
	update = async (event, eventId) => {
		return await setDoc(doc(db, "events", eventId), event);
	};
	delete = async (eventKey) => {
		return await deleteDoc(doc(db, "events", eventKey));
	};
	search = async (q) => {
		const eventsRef = collection(db, "events");
		const qury = query(
			eventsRef,
			orderBy("eventTitle"),
			startAt(q),
			endAt(q + "\uf8ff")
		);
		return await getDocs(qury);
	};
}
export default new EventService();
