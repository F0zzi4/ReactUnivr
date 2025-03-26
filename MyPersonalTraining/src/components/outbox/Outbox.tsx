import { useState, useEffect } from "react";
import { FaInbox, FaTimes } from "react-icons/fa";
import FirebaseObject from "../firebase/firestore/data-model/FirebaseObject";
import FirestoreInterface from "../firebase/firestore/firestore-interface";

export default function Outbox() {
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [recipients, setRecipients] = useState<FirebaseObject[]>([]);
  const [messages, setMessages] = useState<FirebaseObject[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<FirebaseObject | null>(null);
  const [loading, setLoading] = useState(true);

  // get a valid date from a firestore timestamp
  const formatFirestoreDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let recipientList: FirebaseObject[] = [];

        if(user?.UserType === "Customer"){
          const ptId = await FirestoreInterface.getPersonalTrainerId(user.id);
          const pt = await FirestoreInterface.getUserById(ptId);
          recipientList = pt ? [{ ...pt, id: ptId }] : [];
        }else if(user?.UserType === "Personal Trainer"){
          const customersId = await FirestoreInterface.getAllCustomersByPersonalTrainer(user.id);

          const customersPromises = customersId.map(async customerId => {
            return await FirestoreInterface.getUserById(customerId.id);
          });

          // to make sure all the customers will be set before the setRecipients hook
          const customers = (await Promise.all(customersPromises)).filter(customer => customer !== null);
          recipientList = customers;
        }

        setRecipients(recipientList);
        
        const messagesArray = await FirestoreInterface.getAllMessagesBySenderId(user.id);
        setMessages(Array.isArray(messagesArray) ? messagesArray : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipients or messages:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  return (
    <div className="p-6 max-w-4xl mx-auto h-screen flex flex-col">
      <div className="shadow-lg rounded-lg p-6 flex-grow flex flex-col" style={{backgroundColor: "rgb(147, 229, 165)"}}>
        <div
          className="text-white p-4 rounded-t-lg text-center text-2xl font-bold flex items-center justify-center"
          style={{ background: "linear-gradient(to right,rgb(50, 197, 112),rgb(39, 153, 86))" }}
        >
          <FaInbox className="mr-2" /> Outbox
        </div>

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
                  <div className="font-bold text-lg">
                    {recipients.find((rec) => rec.id === msg.recipient)?.Name +
                      " " +
                      recipients.find((rec) => rec.id === msg.recipient)?.Surname ||
                      "Unknown"}
                  </div>

                  <div className="text-gray-600 text-sm mt-1">{msg.subject}: {msg.body}</div>

                  <div className="text-sm text-right mt-2 sm:mt-1 font-bold">
                    {formatFirestoreDate(msg.timestamp)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal per il messaggio selezionato */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="p-6 rounded-lg shadow-lg max-w-lg w-full relative" style={{ backgroundColor: "rgb(133, 204, 148)" }}>
            <h3 className="text-xl font-bold border-b pb-2 mb-4">{selectedMessage.subject}</h3>
            <p className="text-sm text-gray-700 font-semibold">
              To: {recipients.find(rec => rec.id === selectedMessage.recipient)?.Name+" "+recipients.find(rec => rec.id === selectedMessage.recipient)?.Surname || "Unknown"}
            </p>
            <p className="text-sm text-gray-600 mt-1">Date: {formatFirestoreDate(selectedMessage.timestamp)}</p>
            <p className="mt-4 text-lg">{selectedMessage.body}</p>
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