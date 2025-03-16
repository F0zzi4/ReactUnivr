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
  deleteDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import FirebaseObject from "./data-model/FirebaseObject";

// Constants for Firestore collections
const COLLECTIONS = {
  USERS: "users",
  CUSTOMERS: "customers",
  EXERCISES: "exercises",
};

const FirestoreInterface = {
  findUserByEmail: async (email: string): Promise<FirebaseObject | null> => {
    try {
      const q = query(
        collection(Firestore, COLLECTIONS.USERS),
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
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  findUserById: async (id: string): Promise<FirebaseObject | null> => {
    try {
      const userDocRef = doc(Firestore, COLLECTIONS.USERS, id);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  getAllCustomersByPersonalTrainer: async (
    PersonalTrainerId: string
  ): Promise<FirebaseObject[]> => {
    try {
      const customersRef = collection(
        Firestore,
        `${COLLECTIONS.USERS}/${PersonalTrainerId}/${COLLECTIONS.CUSTOMERS}`
      );
      const querySnapshot = await getDocs(customersRef);

      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("General error:", error);
      return [];
    }
  },

  updateUser: async (user: FirebaseObject): Promise<void> => {
    try {
      const userRef = doc(Firestore, COLLECTIONS.USERS, user.id);
      await updateDoc(userRef, { ...user });
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
      const existingUser = await FirestoreInterface.findUserByEmail(
        customer.Email
      );
      if (existingUser) {
        throw new Error("A user with this email already exists.");
      }
      await createUserWithEmailAndPassword(Auth, customer.Email, password);
      
      const { id, ...customerWithoutId } = customer;
      await setDoc(doc(Firestore, `${COLLECTIONS.USERS}/${customer.id}`), customerWithoutId);
      await setDoc(doc(Firestore, `${COLLECTIONS.USERS}/${personalTrainerId}/${COLLECTIONS.CUSTOMERS}/${customer.id}`), {});
    } catch (error: any) {
      throw new Error(error.message || "An unknown error occurred.");
    }
  },

  getAllExercises: async (): Promise<FirebaseObject[]> => {
    try {
      const exercisesRef = collection(Firestore, COLLECTIONS.EXERCISES);
      const querySnapshot = await getDocs(exercisesRef);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return [];
    }
  },

  createExercise: async (exercise: FirebaseObject): Promise<void> => {
    try {
      exercise.id = normalizeExerciseName(exercise.id);
      const exerciseRef = doc(Firestore, COLLECTIONS.EXERCISES, exercise.id);
      await setDoc(exerciseRef, { ...exercise });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  },

  deleteUsers: async (users: string[], personalTrainerId: string): Promise<void> => {
    try {
      await Promise.all(users.map(async (userId) => {
        await deleteDoc(doc(Firestore, COLLECTIONS.USERS, userId));
        await deleteDoc(doc(Firestore, `${COLLECTIONS.USERS}/${personalTrainerId}/${COLLECTIONS.CUSTOMERS}`, userId));
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  },

  deleteExercises: async (exercises: string[]): Promise<void> => {
    try {
      await Promise.all(exercises.map(async (exerciseId) => {
        await deleteDoc(doc(Firestore, COLLECTIONS.EXERCISES, exerciseId));
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  },
};

const normalizeExerciseName = (id: string): string => {
  return id
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

export default FirestoreInterface;