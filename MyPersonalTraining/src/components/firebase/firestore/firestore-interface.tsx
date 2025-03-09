import { Firestore } from "../authentication/firebase-appconfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
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

  findUserById: async (id: string): Promise<FirebaseObject | null> => {
    try {
      const userDocRef = doc(Firestore, "users", id);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const user: FirebaseObject = { id: userDoc.id, ...userDoc.data() };
        return user;
      } else {
        console.log("Nessun utente trovato con questo ID.");
        return null;
      }
    } catch (error) {
      console.error("Errore nella ricerca:", error);
      return null;
    }
  },

  getAllCustomersByPersonalTrainer: async (PersonalTrainerId: string): Promise<FirebaseObject[]> => { 
    try {
        const customersRef = collection(Firestore, `users/${PersonalTrainerId}/Customers`);
        const querySnapshot = await getDocs(customersRef);

        const customers: FirebaseObject[] = [];
        querySnapshot.forEach((doc) => {
            customers.push({ id: doc.id, ...doc.data() });
        });

        return customers;
    } catch (error) {
        console.error("Errore nel recupero dei clienti:", error);
        return [];
    }
  },
};

export default FirestoreInterface;
