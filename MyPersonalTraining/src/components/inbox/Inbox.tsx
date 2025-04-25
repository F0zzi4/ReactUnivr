import { useState, useEffect } from "react";
import { FaInbox, FaPencilAlt, FaTimes } from "react-icons/fa";
import FirebaseObject from "../firebase/firestore/data-model/FirebaseObject";
import FirestoreInterface from "../firebase/firestore/firestore-interface";

export default function Inbox() {
  // Retrieve user from session storage
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Component state
  const [senders, setSenders] = useState<FirebaseObject[]>([]);
  const [selectedSender, setSelectedSender] = useState<string>("");
  const [messages, setMessages] = useState<FirebaseObject[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<FirebaseObject | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState<FirebaseObject>({
    id: "",
    to: "",
    subject: "",
    body: "",
    timestamp: Date.now(),
    read: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Convert Firestore timestamp to human-readable date
  const formatFirestoreDate = (timestamp: {
    seconds: number;
    nanoseconds: number;
  }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  // Load messages and recipient list when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        let recipientList: FirebaseObject[] = [];

        // Load recipients depending on user type
        if (user?.UserType === "Customer") {
          const ptId = await FirestoreInterface.getPersonalTrainerId(user.id);
          const pt = await FirestoreInterface.getUserById(ptId);
          recipientList = pt ? [{ ...pt, id: ptId }] : [];
        } else if (user?.UserType === "Personal Trainer") {
          const customersId = await FirestoreInterface.getAllCustomersByPersonalTrainer(user.id);
          const customersPromises = customersId.map(async (customerId) =>
            await FirestoreInterface.getUserById(customerId.id)
          );
          const customers = (await Promise.all(customersPromises)).filter(
            (customer) => customer !== null
          );
          recipientList = customers;
        }

        setSenders(recipientList);

        // Fetch all messages for current user
        let messagesArray = await FirestoreInterface.getAllMessagesByRecipientId(user.id);

        // Sort messages by descending date
        messagesArray = Array.isArray(messagesArray)
          ? messagesArray.sort((a, b) => b.timestamp - a.timestamp)
          : [];

        setMessages(messagesArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipients or messages:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  // When selecting a message, mark it as read if it’s unread
  const handleSelectMessage = async (msg: FirebaseObject) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      try {
        await FirestoreInterface.updateMessage(msg.id, !msg.read);
        setMessages((prevMessages) =>
          prevMessages.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
        );
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.to || !newMessage.subject || !newMessage.body) {
      setError("All fields are required!");
      return;
    }

    try {
      await FirestoreInterface.createMessage(
        user.id,
        newMessage.to,
        newMessage.subject,
        newMessage.body
      );
      setIsComposeOpen(false);
      window.location.reload(); // Reload to fetch the latest messages
      setNewMessage({
        id: "",
        to: "",
        subject: "",
        body: "",
        timestamp: Date.now(),
        read: false,
      });
      setError(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-screen flex flex-col">
      {/* Inbox Container */}
      <div
        className="relative flex-grow flex flex-col shadow-lg rounded-lg p-6"
        style={{ background: "rgb(147, 229, 165)" }}
      >
        {/* Header */}
        <div
          className="text-white p-4 rounded-t-lg text-center text-2xl font-bold flex items-center justify-center"
          style={{
            background: "linear-gradient(to right,rgb(50, 197, 112),rgb(39, 153, 86))",
          }}
        >
          <FaInbox className="mr-2" /> Inbox
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center p-4 font-semibold">Loading messages...</div>
        ) : (
          <ul className="p-4 flex-grow overflow-y-auto max-h-96 space-y-2">
            {/* Message List */}
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`border-b py-4 px-4 cursor-pointer rounded-lg transition duration-200 ${
                  msg.read
                    ? "bg-white hover:bg-gray-200"
                    : "bg-green-500 text-white font-bold"
                }`}
                onClick={() => handleSelectMessage(msg)}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-lg">
                      {
                        senders.find((sender) => sender.id === msg.sender)
                          ?.Name +
                          " " +
                          senders.find((rec) => rec.id === msg.sender)?.Surname || "Unknown"
                      }
                    </div>
                  </div>

                  <div className="text-sm mt-1">
                    {msg.subject}: {msg.body}
                  </div>

                  <div className="text-sm text-right mt-2 sm:mt-1 font-bold">
                    {formatFirestoreDate(msg.timestamp)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Compose Message Button */}
        <button
          className="absolute bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
          onClick={() => setIsComposeOpen(true)}
        >
          <FaPencilAlt size={30} />
        </button>
      </div>

      {/* Modal for message details */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="p-6 rounded-lg shadow-lg max-w-lg w-full relative bg-white">
            <h3 className="text-xl font-bold border-b pb-2 mb-4">
              {selectedMessage.subject}
            </h3>
            <p className="text-sm text-gray-700 font-semibold">
              From:{" "}
              {senders.find((sender) => sender.id === selectedMessage.sender)?.Name || "Unknown"}{" "}
              {senders.find((sender) => sender.id === selectedMessage.sender)?.Surname || ""}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Date: {formatFirestoreDate(selectedMessage.timestamp)}
            </p>
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

      {/* Modal for composing new message */}
      {isComposeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className="p-6 rounded-lg shadow-lg max-w-lg w-full"
            style={{ backgroundColor: "rgb(133, 204, 148)" }}
          >
            <h3 className="text-xl font-semibold mb-3">New Message</h3>
            {/* Recipient selector */}
            <select
              className="w-full p-3 border rounded mb-3"
              value={selectedSender}
              onChange={(e) => {
                setSelectedSender(e.target.value);
                setNewMessage({ ...newMessage, to: e.target.value });
              }}
            >
              <option value="">Select recipient</option>
              {senders.map((rec) => (
                <option key={rec.id} value={rec.id}>
                  {rec.Name ? rec.Name : "Unknown"} {rec.Surname ? rec.Surname : ""}
                </option>
              ))}
            </select>

            {/* Subject input */}
            <input
              type="text"
              placeholder="Subject"
              className="w-full p-3 border rounded mb-3"
              value={newMessage.subject}
              onChange={(e) =>
                setNewMessage({ ...newMessage, subject: e.target.value })
              }
            />

            {/* Message body */}
            <textarea
              placeholder="Message"
              className="w-full p-3 border rounded mb-3"
              rows={5}
              value={newMessage.body}
              onChange={(e) =>
                setNewMessage({ ...newMessage, body: e.target.value })
              }
            ></textarea>

            {/* Error message */}
            {error && <div className="text-red-700 mb-3 font-bold">{error}</div>}

            {/* Compose actions */}
            <div className="flex justify-end">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsComposeOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}