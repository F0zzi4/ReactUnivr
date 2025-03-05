import { AiOutlineFileText } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { MdOutlineInbox, MdSend, MdOutlineDashboard } from "react-icons/md";

const sidebarData = (user: any) => {
  const commonItems = [
    { icon: <MdOutlineInbox size={24} />, label: "Inbox", path: "/inbox" },
    { icon: <MdSend size={24} />, label: "Outbox", path: "/outbox" },
  ];

  const roleBasedItems =
    user?.UserType === "Personal Trainer"
      ? [
          { icon: <AiOutlineFileText size={24} />, label: "Plan Management", path: "/personalTrainer/planManagement" },
          { icon: <FaUsers size={24} />, label: "Customers", path: "/personalTrainer/customers" },
          { icon: <MdOutlineDashboard size={24} />, label: "Exercises", path: "/personalTrainer/exercises" },
        ]
      : [
          { icon: <FaUsers size={24} />, label: "Me", path: "/me" },
          { icon: <AiOutlineFileText size={24} />, label: "Training Plan", path: "/customer/trainingPlan" },
          { icon: <GoGoal size={24} />, label: "Goals", path: "/goals" },
        ];

  return [...commonItems, ...roleBasedItems];
};

export default sidebarData;
