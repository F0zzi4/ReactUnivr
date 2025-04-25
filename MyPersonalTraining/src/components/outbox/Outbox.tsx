import { useState, useEffect } from "react";
import { FaInbox, FaTimes } from "react-icons/fa";
import FirebaseObject from "../firebase/firestore/data-model/FirebaseObject";
import FirestoreInterface from "../firebase/firestore/firestore-interface";

export default function Outbox() {
  // Retrieve logged-in user from session storage
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // State to store all message recipients (either a PT or a list of customers)
  const [recipients, setRecipients] = useState<FirebaseObject[]>([]);

  // State to store messages sent by the current user
  const [messages, setMessages] = useState<FirebaseObject[]>([]);

  // State to store currently selected message for modal display
  const [selectedMessage, setSelectedMessage] = useState<FirebaseObject | null>(null);

  // State to handle loading state while fetching data
  const [loading, setLoading] = useState(true);

  // Converts Firestore timestamp to a readable date string
  const formatFirestoreDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  // Fetch recipients and messages when component mounts or when user ID changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        let recipientList: FirebaseObject[] = [];

        // If user is a customer, get their assigned personal trainer
        if (user?.UserType === "Customer") {
          const ptId = await FirestoreInterface.getPersonalTrainerId(user.id);
          const pt = await FirestoreInterface.getUserById(ptId);
          recipientList = pt ? [{ ...pt, id: ptId }] : [];
        } 
        // If user is a personal trainer, get all of their customers
        else if (user?.UserType === "Personal Trainer") {
          const customersId = await FirestoreInterface.getAllCustomersByPersonalTrainer(user.id);

          // Fetch all customer details in parallel
          const customersPromises = customersId.map(async (customerId) => {
            return await FirestoreInterface.getUserById(customerId.id);
          });

          // Remove any null values from the results
          const customers = (await Promise.all(customersPromises)).filter(
            (customer) => customer !== null
          );
          recipientList = customers;
        }

        // Update recipients list in state
        setRecipients(recipientList);

        // Fetch all messages where the current user is the sender
        const messagesArray = await FirestoreInterface.getAllMessagesBySenderId(user.id);
        setMessages(Array.isArray(messagesArray) ? messagesArray : []);
      } catch (error) {
        console.error("Error fetching recipients or messages:", error);
      } finally {
        // Stop loading indicator regardless of success/failure
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  return (
    <div className="p-6 max-w-4xl mx-auto h-screen flex flex-col">
      <div
        className="shadow-lg rounded-lg p-6 flex-grow flex flex-col"
        style={{ backgroundColor: "rgb(147, 229, 165)" }}
      >
        {/* Header with gradient and icon */}
        <div
          className="text-white p-4 rounded-t-lg text-center text-2xl font-bold flex items-center justify-center"
          style={{
            background: "linear-gradient(to right,rgb(50, 197, 112),rgb(39, 153, 86))",
          }}
        >
          <FaInbox className="mr-2" /> Outbox
        </div>

        {/* Loading state or message list */}
        {loading ? (
          <div className="text-center p-4 font-semibold">Loading messages...</div>
        ) : (
          <ul className="p-4 flex-grow overflow-y-auto max-h-96 space-y-2">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="border-b py-4 px-4 cursor-pointer bg-white hover:bg-gray-200 rounded-lg transition duration-200"
                onClick={() => setSelectedMessage(msg)}
              >
                <div className="flex flex-col">
                  {/* Display recipient full name or fallback to 'Unknown' */}
                  <div className="font-bold text-lg">
                    {recipients.find((rec) => rec.id === msg.recipient)?.Name +
                      " " +
                      recipients.find((rec) => rec.id === msg.recipient)?.Surname || "Unknown"}
                  </div>

                  {/* Message subject and preview */}
                  <div className="text-gray-600 text-sm mt-1">
                    {msg.subject}: {msg.body}
                  </div>

                  {/* Timestamp formatted */}
                  <div className="text-sm text-right mt-2 sm:mt-1 font-bold">
                    {formatFirestoreDate(msg.timestamp)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for displaying a selected message */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="p-6 rounded-lg shadow-lg max-w-lg w-full relative bg-white">
            <h3 className="text-xl font-bold border-b pb-2 mb-4">
              {selectedMessage.subject}
            </h3>

            {/* Display recipient info */}
            <p className="text-sm text-gray-700 font-semibold">
              To:{" "}
              {recipients.find((rec) => rec.id === selectedMessage.recipient)?.Name +
                " " +
                recipients.find((rec) => rec.id === selectedMessage.recipient)?.Surname || "Unknown"}
            </p>

            {/* Date of the message */}
            <p className="text-sm text-gray-600 mt-1">
              Date: {formatFirestoreDate(selectedMessage.timestamp)}
            </p>

            {/* Full message body */}
            <p className="mt-4 text-lg">{selectedMessage.body}</p>

            {/* Close button */}
            <button
              className="absolute top-3 right-3 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-110"
              onClick={() => setSelectedMessage(null)}
            >
              <FaTimes size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}