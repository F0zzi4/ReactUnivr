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
  TRAINING_PLANS: "training-plans"
};

const FirestoreInterface = {
  getUserByEmail: async (email: string): Promise<FirebaseObject | null> => {
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

  getUserById: async (id: string): Promise<FirebaseObject | null> => {
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

  updateExercise: async (exercise: FirebaseObject): Promise<void> => {
    try {
      const exerciseRef = doc(Firestore, COLLECTIONS.EXERCISES, exercise.id);
      await updateDoc(exerciseRef, { ...exercise });
    } catch (error) {
      console.error("Error updating exercise data:", error);
    }
  },

  createCustomer: async (
    customer: FirebaseObject,
    password: string,
    personalTrainerId: string
  ): Promise<void> => {
    try {
      const existingUser = await FirestoreInterface.getUserByEmail(
        customer.Email
      );
      if (existingUser) {
        throw new Error("A user with this email already exists.");
      }
      await createUserWithEmailAndPassword(Auth, customer.Email, password);

      const { id, ...customerWithoutId } = customer;
      await setDoc(
        doc(Firestore, `${COLLECTIONS.USERS}/${customer.id}`),
        customerWithoutId
      );
      await setDoc(
        doc(
          Firestore,
          `${COLLECTIONS.USERS}/${personalTrainerId}/${COLLECTIONS.CUSTOMERS}/${customer.id}`
        ),
        {}
      );
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

  getAllPlansByPersonalTrainer: async (id: string): Promise<FirebaseObject[]> => {
    try {
      const plansRef = collection(Firestore, COLLECTIONS.TRAINING_PLANS);
      
      // Defining a range to take any document that starts with {id}
      const startId = id;
      const endId = id + "\uf8ff"; // "\uf8ff" is the last Unicode char, so includes anything that starts with {id}
      
      const q = query(plansRef, where("__name__", ">=", startId), where("__name__", "<", endId));
  
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching plans:", error);
      return [];
    }
  },

  getPlanById: async (id: string): Promise<FirebaseObject | null> => {
    try {
      const trainingPlanRef = doc(Firestore, COLLECTIONS.TRAINING_PLANS, id);
      const trainingPlanDoc = await getDoc(trainingPlanRef);
      console.log(trainingPlanDoc);
      if (trainingPlanDoc.exists()) {
        return { id: trainingPlanDoc.id, ...trainingPlanDoc.data() };
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  getExercisesPlanByDayNo: async (id: string, dayNo: string): Promise<FirebaseObject[] | null> => {
    try {
        const trainingPlanRef = doc(Firestore, COLLECTIONS.TRAINING_PLANS, id);
        const trainingPlanDoc = await getDoc(trainingPlanRef);

        if (trainingPlanDoc.exists()) {
            const data = trainingPlanDoc.data();
            return data[dayNo] || null;
        }

        return null;
    } catch (error) {
        console.error("Error fetching exercises for the training plan:", error);
        return null;
    }
  },

  updatePlanById: async (planId: string, dayNo: string, exercises: FirebaseObject[]): Promise<void> => {
    try {
        const planRef = doc(Firestore, COLLECTIONS.TRAINING_PLANS, planId);
        await updateDoc(planRef, {
            [dayNo]: exercises,
        });
    } catch (error) {
        console.error("Error updating training plan:", error);
    }
  },

  createExercise: async (exercise: FirebaseObject): Promise<void> => {
    try {
      exercise.id = normalizeExerciseName(exercise.id);
      const exerciseRef = doc(Firestore, COLLECTIONS.EXERCISES, exercise.id);
      await setDoc(exerciseRef, { ...exercise });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  },

  createTrainingPlan: async (personalTrainerId: string, customerID : string): Promise<void> => {
    try {
      const trainingPlanId = `${personalTrainerId}-${customerID}`; // Concat both of the ID
      const trainingPlanRef = doc(Firestore, "training-plans", trainingPlanId);
  
      await setDoc(trainingPlanRef, {});
    } catch (error) {
      console.error("Error during training plan creation:", error);
    }
  },

  deleteUsers: async (
    users: string[],
    personalTrainerId: string
  ): Promise<void> => {
    try {
      await Promise.all(
        users.map(async (userId) => {
          await deleteDoc(doc(Firestore, COLLECTIONS.USERS, userId));
          await deleteDoc(
            doc(
              Firestore,
              `${COLLECTIONS.USERS}/${personalTrainerId}/${COLLECTIONS.CUSTOMERS}`,
              userId
            )
          );
        })
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  },

  deleteExercises: async (exercises: string[]): Promise<void> => {
    try {
      await Promise.all(
        exercises.map(async (exerciseId) => {
          await deleteDoc(doc(Firestore, COLLECTIONS.EXERCISES, exerciseId));
        })
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
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
