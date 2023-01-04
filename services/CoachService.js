import {
	doc,
	query,
	getDocs,
	collection,
	where,
	setDoc,
	getFirestore,
	addDoc,
	deleteDoc,
	orderBy,
	startAt,
	endAt,
} from "firebase/firestore";
import { db } from "../config/firebase";
class CoachService {
	#db;
	constructor() {
		this.#db = db;
	}
	create = async (coach) => {
		coach.createdAt = Date.now();
		return await addDoc(collection(this.#db, "coaches"), coach);
	};
	delete = async (coachKey) => {
		return await deleteDoc(doc(this.#db, "coaches", coachKey));
	};
	fetchCoach = async (field, val) => {
		const cRef = collection(this.#db, "coaches");
		const cQ = query(cRef, where(`${field}`, "==", val));
		return getDocs(cQ);
	};
	update = async (coach, key) => {
		return await setDoc(doc(this.#db, "coaches", key), coach, {
			merge: true,
		});
	};
	search = async (q) => {
		const coachesRef = collection(this.#db, "coaches");
		const qury = query(
			coachesRef,
			orderBy("fName"),
			startAt(q),
			endAt(q + "\uf8ff")
		);
		return await getDocs(qury);
	};
}
export default new CoachService();
