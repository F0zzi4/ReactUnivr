import { Firestore } from "../authentication/firebase-appconfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import FirebaseObject from "./data-model/FirebaseObject";

const FirestoreInterface = {
  findUserByEmail: async (email: string): Promise<FirebaseObject | null> => {
    try {
      const q = query(collection(Firestore, "users"), where("Email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let user: FirebaseObject | null = null;
        for (const doc of querySnapshot.docs) {
          user = { id: doc.id, ...doc.data() };
          break;
        }
        return user;
      } else {
        console.log("Nessun utente trovato con questa email.");
        return null;
      }
    } catch (error) {
      console.error("Errore nella ricerca:", error);
      return null;
    }
  }
};

export default FirestoreInterface;