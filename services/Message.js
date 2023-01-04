import { child, get, push, ref, set } from "firebase/database";
import { collection, addDoc } from "firebase/firestore";
import { database, db } from "../config/firebase";
class Message {
  sendMessage = async (message) => {
    return addDoc(collection(db, `messages`), message);
  };

  sendMessage2 = async (message, chatKey) => {
    const dbRef = ref(database, "/messages");
    if (!chatKey) {
      chatKey = push(dbRef).key;
    }
    push(ref(database, `/messages/${chatKey}`), message);

    this.createRecent(message, chatKey);
    return chatKey;
  };

  createRecent = async (message, chatkey) => {
    const messRef = ref(database, `recentMessages/${chatkey}`);
    set(messRef, message);
  };

  getChatKey = async () => {
    const dbRef = ref(db);
    return get(child(dbRef, "messages"));
  };
}

export default new Message();
