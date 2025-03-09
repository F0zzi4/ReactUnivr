// FirestoreInterface.ts
import { Firestore } from "../authentication/firebase-appconfig"; // Verifica che sia corretto il percorso
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import FirebaseObject from "./data-model/FirebaseObject";

const FirestoreInterface = {
  findUserByEmail: async (email: string): Promise<FirebaseObject | null> => {
    try {
      const q = query(
        collection(Firestore, "users"),
        where("Email", "==", email)
      );
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
  },

  getAllCostumers: async (): Promise<FirebaseObject[]> => {
    try {
      const q = query(
        collection(Firestore, "users"),
        where("UserType", "==", "Customer")
      );
      const querySnapshot = await getDocs(q);

      const costumers: FirebaseObject[] = [];
      querySnapshot.forEach((doc) => {
        costumers.push({ id: doc.id, ...doc.data() });
      });

      return costumers;
    } catch (error) {
      console.error("Errore nel recupero dei clienti:", error);
      return [];
    }
  },

  updateUser: async (user: FirebaseObject): Promise<void> => {
    try {
      const userRef = doc(Firestore, "users", user.id); // Create a reference to the specific user document

      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Update the user with the new data
        await updateDoc(userRef, {
          ...userData, // Keep existing data
          Weight: user.Weight,
          Name: user.Name,
          Surname: user.Surname,
          DateOfBirth: user.DateOfBirth,
          Height: user.Height,
        });
        console.log("User data updated successfully!");
      } else {
        console.log("User document does not exist!");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  },
};

export default FirestoreInterface;
