import { Firestore, Auth } from "../authentication/firebase-appconfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

  getAllCustomersByPersonalTrainer: async (
    PersonalTrainerId: string
  ): Promise<FirebaseObject[]> => {
    try {
      const customersRef = collection(
        Firestore,
        `users/${PersonalTrainerId}/customers`
      );
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

  createCustomer: async (
    customer: FirebaseObject,
    password: string,
    personalTrainerId: string
  ): Promise<void> => {
    try {
      // Check if the user already exists
      const existingUser = await FirestoreInterface.findUserByEmail(customer.Email);
  
      if (existingUser) {
        console.error("A user with this email already exists:", customer.Email);
        throw new Error("A user with this email already exists.");
      }
  
      // Creation of the user in Firebase Authentication
      await createUserWithEmailAndPassword(Auth, customer.Email, password);
  
      // Creation the doc in the main collection of users
      const { id, ...customerWithoutId } = customer;
      const userRef = doc(Firestore, `users/${customer.id}`);
      await setDoc(userRef, { ...customerWithoutId});
  
      // Creation the doc in the struct "users/{personalTrainerId}/customers/{customerId}"
      const customerRef = doc(Firestore, `users/${personalTrainerId}/customers/${customer.id}`);
      await setDoc(customerRef, { });  // Set no fields in the doc reference 
    } catch (error: any) {
      console.error("Error creating customer:", error.message);
      throw new Error(error.message);
    }
  },
};

export default FirestoreInterface;
