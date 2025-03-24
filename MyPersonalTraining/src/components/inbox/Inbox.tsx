import { useState } from "react";
import { FaInbox, FaPencilAlt, FaTimes } from "react-icons/fa";
import FirebaseObject from "../firebase/firestore/data-model/FirebaseObject";

const messages: FirebaseObject[] = [
  { id: "1", sender: "John Doe", subject: "Workout Plan Update", body: "Your new workout plan is ready.", timestamp: 1712345678 },
  { id: "2", sender: "Jane Smith", subject: "Diet Plan", body: "Here's your new diet plan for the month.", timestamp: 1712345689 },
  { id: "3", sender: "Coach Mike", subject: "Training Tips", body: "Remember to stretch before and after workouts.", timestamp: 1712345699 }
];

export default function Inbox() {
  const [selectedMessage, setSelectedMessage] = useState<FirebaseObject | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newMessage, setNewMessage] = useState<FirebaseObject>({ id: "", to: "", subject: "", body: "", timestamp: Date.now() });

  return (
    <div className="p-6 max-w-4xl mx-auto h-screen flex flex-col"> 
      <div className="shadow-lg rounded-lg p-6 flex-grow flex flex-col" style={{ backgroundColor: "rgb(147, 229, 165)" }}>
      <div className="bg-green-600 text-white p-4 rounded-t-lg text-center text-2xl font-bold flex items-center justify-center">
          <FaInbox className="mr-2" /> Inbox
        </div>
        <ul className="p-4 flex-grow overflow-auto">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="border-b py-4 cursor-pointer hover:bg-gray-100 px-2"
              onClick={() => setSelectedMessage(msg)}
            >
              <div className="font-bold text-lg">{msg.sender}</div>
              <div className="text-gray-600 text-sm">{msg.subject}</div>
            </li>
          ))}
        </ul>
        <button
          className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg"
          onClick={() => setIsComposeOpen(true)}
        >
          <FaPencilAlt size={30} />
        </button>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4">{selectedMessage.subject}</h3>
            <p className="text-sm text-gray-500">From: {selectedMessage.sender}</p>
            <p className="mt-4 text-lg">{selectedMessage.body}</p>
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              onClick={() => setSelectedMessage(null)}
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}

      {isComposeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-3">New Message</h3>
            <input
              type="text"
              placeholder="To"
              className="w-full p-3 border rounded mb-3"
              value={newMessage.to}
              onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full p-3 border rounded mb-3"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
            />
            <textarea
              placeholder="Message"
              className="w-full p-3 border rounded mb-3"
              rows={5}
              value={newMessage.body}
              onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsComposeOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => { setIsComposeOpen(false); alert("Message Sent!") }}
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