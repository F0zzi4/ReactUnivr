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
  addDoc,
  Timestamp,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import FirebaseObject from "./data-model/FirebaseObject";

// Constants for Firestore collections
const COLLECTIONS = {
  USERS: "users",
  CUSTOMERS: "customers",
  EXERCISES: "exercises",
  TRAINING_PLANS: "training-plans",
  GOALS: "goals",
  MESSAGES: "messages",
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

  getAllPlansByPersonalTrainer: async (
    id: string
  ): Promise<FirebaseObject[]> => {
    try {
      const plansRef = collection(Firestore, COLLECTIONS.TRAINING_PLANS);

      // Defining a range to take any document that starts with {id}
      const startId = id;
      const endId = id + "\uf8ff"; // "\uf8ff" is the last Unicode char, so includes anything that starts with {id}

      const q = query(
        plansRef,
        where("__name__", ">=", startId),
        where("__name__", "<", endId)
      );

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

  getPlanByCustomerId: async (
    customerId: string
  ): Promise<FirebaseObject[]> => {
    try {
      const plansRef = collection(Firestore, COLLECTIONS.TRAINING_PLANS);
      const querySnapshot = await getDocs(plansRef);

      // Filtra i documenti con ID che termina con `-{customerId}`
      const filteredDocs = querySnapshot.docs
        .filter((doc) => doc.id.endsWith(`-${customerId}`))
        .map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

      if (filteredDocs.length === 0) return [];

      // Estrai solo i campi relativi ai giorni e assegna un ID unico
      const daysArray: FirebaseObject[] = filteredDocs.flatMap(({ id, data }) =>
        Object.keys(data)
          .filter((key) => key.startsWith("Day ")) // Prendi solo chiavi che iniziano con "Day "
          .sort((a, b) => {
            // Estrai i numeri dai nomi dei giorni (es. "Day 1" -> 1, "Day 10" -> 10)
            const numA = parseInt(a.replace("Day ", ""), 10);
            const numB = parseInt(b.replace("Day ", ""), 10);
            return numA - numB; // Ordina numericamente
          })
          .map((dayKey) => ({
            id: `${id}-${dayKey}`, // ID univoco
            name: dayKey, // Nome del giorno
            exercises: data[dayKey], // Lista di esercizi
          }))
      );

      return daysArray;
    } catch (error) {
      console.error("Error fetching training plans:", error);
      return [];
    }
  },

  getExercisesPlanByDayNo: async (
    id: string,
    dayNo: string
  ): Promise<FirebaseObject[] | null> => {
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

  getGoalsByCustomerId: async (
    id: string
  ): Promise<FirebaseObject[] | null> => {
    try {
      const goalsRef = collection(
        Firestore,
        COLLECTIONS.USERS,
        id,
        COLLECTIONS.GOALS
      );
      const querySnapshot = await getDocs(goalsRef);

      const goals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return goals;
    } catch (error) {
      console.error("Error fetching goals for the user:", error);
      return null;
    }
  },

  addGoalByCustomerId: async (
    userId: string,
    goal: FirebaseObject
  ): Promise<FirebaseObject[] | null> => {
    try {
      await addDoc(collection(Firestore, COLLECTIONS.USERS, userId, "goals"), {
        name: goal.name,
        targetValue: goal.targetValue,
        completed: goal.completed || false,
      });

      // Recupera tutti i goals aggiornati
      const snapshot = await getDocs(
        collection(Firestore, COLLECTIONS.USERS, userId, "goals")
      );
      const updatedGoals: FirebaseObject[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseObject[];

      return updatedGoals;
    } catch (error) {
      console.error("Error adding goal:", error);
      return null;
    }
  },

  updateGoalByCustomerId: async (
    userId: string,
    goal: FirebaseObject
  ): Promise<void> => {
    try {
      const goalsRef = collection(
        Firestore,
        COLLECTIONS.USERS,
        userId,
        "goals"
      );

      const snapshot = await getDocs(goalsRef);
      const existingGoalDoc = snapshot.docs.find(
        (docItem) => docItem.id === goal.id
      );

      if (existingGoalDoc) {
        await updateDoc(doc(Firestore, goalsRef.path, goal.id), {
          name: goal.name,
          targetValue: goal.targetValue,
          completed: goal.completed || false,
        });
      }
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  },

  removeGoalsByCustomerId: async (
    userId: string,
    goals: FirebaseObject[]
  ): Promise<void> => {
    try {
      const goalsRef = collection(
        Firestore,
        COLLECTIONS.USERS,
        userId,
        "goals"
      );

      // Fetch all goals
      const snapshot = await getDocs(goalsRef);

      // Iterate over the passed goals and delete them if they exist
      for (const goal of goals) {
        const goalDoc = snapshot.docs.find((docItem) => docItem.id === goal.id);
        if (goalDoc) {
          await deleteDoc(doc(Firestore, goalsRef.path, goal.id));
        }
      }
    } catch (error) {
      console.error("Error removing goals:", error);
    }
  },

  updatePlanById: async (
    planId: string,
    dayNo: string,
    exercises: FirebaseObject[]
  ): Promise<void> => {
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

  createTrainingPlan: async (
    personalTrainerId: string,
    customerID: string
  ): Promise<void> => {
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

  createMessage: async (
    sender: string,
    recipient: string,
    subject: string,
    body: string
  ): Promise<void> => {
    try {
      const newMessage = {
        sender: sender,
        recipient: recipient,
        subject: subject,
        body: body,
        timestamp: Timestamp.fromDate(new Date()),
        read: false,
      };

      // Add a message in collection "messages" with random and valid ID
      await addDoc(collection(Firestore, "messages"), newMessage);
    } catch (e) {
      console.error("Error adding message: ", e);
    }
  },

  updateMessage: async (messageId: string, read: boolean): Promise<void> => {
    try {
      const messageRef = doc(Firestore, "messages", messageId);

      await updateDoc(messageRef, {
        read: read,
      });
    } catch (e) {
      console.error("Error updating message: ", e);
    }
  },

  getAllMessagesBySenderId: async (
    senderId: string
  ): Promise<FirebaseObject[] | undefined> => {
    try {
      const messagesRef = collection(Firestore, COLLECTIONS.MESSAGES);
      const q = query(messagesRef, where("sender", "==", senderId));
      const querySnapshot = await getDocs(q);

      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return messages;
    } catch (e) {
      console.error("Error retrieving messages: ", e);
    }
  },

  getAllMessagesByRecipientId: async (
    recipientId: string
  ): Promise<FirebaseObject[] | undefined> => {
    try {
      const messagesRef = collection(Firestore, COLLECTIONS.MESSAGES);
      const q = query(messagesRef, where("recipient", "==", recipientId));
      const querySnapshot = await getDocs(q);

      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return messages;
    } catch (e) {
      console.error("Error retrieving messages: ", e);
    }
  },

  getPersonalTrainerId: async (customerId: string): Promise<string> => {
    try {
      // Ottieni tutti gli utenti dalla collezione "users"
      const usersRef = collection(Firestore, COLLECTIONS.USERS);
      const usersSnapshot = await getDocs(usersRef);

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;

        // Verifica se la raccolta "customers" esiste sotto "users/{userId}"
        const customersRef = collection(
          Firestore,
          `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.CUSTOMERS}`
        );
        const customersSnapshot = await getDocs(customersRef);

        // Se la raccolta "customers" non contiene documenti, passa al prossimo utente
        if (customersSnapshot.empty) continue;

        const customerExists = customersSnapshot.docs.some(
          (doc) => doc.id === customerId
        );

        if (customerExists) {
          return userId;
        }
      }

      return ""; // Nessun personal trainer trovato
    } catch (error) {
      console.error("Error retrieving personal trainer:", error);
      return "";
    }
  },

  async resetPassword(email: string): Promise<string> {
    try {
      await sendPasswordResetEmail(Auth, email);
      return "Password reset link has been sent to your email.";
    } catch (error: any) {
      throw new Error(error.message || "Failed to send password reset email.");
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
