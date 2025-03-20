import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Box } from "@mui/material";
import TrainingPlan from "../plan-management/TrainingPlan";

interface FormData {
  id: string;
  Email: string;
  Name: string;
  Surname: string;
  DateOfBirth: string;
  Height: number;
  Weight: number;
}

export default function Customer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;

  const [formData, setFormData] = useState<FormData>({
    id: customer?.id || "",
    Email: customer?.Email || "",
    Name: customer?.Name || "",
    Surname: customer?.Surname || "",
    DateOfBirth: customer?.DateOfBirth || "",
    Height: customer?.Height || 0,
    Weight: customer?.Weight || 0,
  });

  if (!customer) {
    return <p>No customer selected.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Height" || name === "Weight" ? Number(value) : value,
    }));
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="w-11/12 max-w-2xl bg-white p-10 shadow-xl rounded-xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-green-600 hover:bg-green-100 mb-6 transition-colors duration-200 py-1 px-1 rounded-md"
          style={{
            
          }}
        >
          <FaArrowLeft className="mr-2 hover:text-green-600 transition-colors duration-200" />
          <span className="font-semibold">Back</span>
        </button>

        <form>
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ marginBottom: "20px" }}>Personal Info</h2>

          {/* Nickname */}
          <div className="mb-5">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Nick Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none"
              type="text"
              value={formData?.id || ""}
              readOnly
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Email
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none"
              type="email"
              value={formData?.Email || ""}
              readOnly
            />
          </div>

          {/* First Name and Last Name */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                First Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Last Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
                type="text"
                name="Surname"
                value={formData.Surname}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="mb-5">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Date of Birth
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
              type="date"
              name="DateOfBirth"
              value={formData.DateOfBirth}
              onChange={handleChange}
              readOnly
            />
          </div>

          {/* Save / Edit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true)
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-7 rounded-md text-lg"
            >
              Manage Plan
            </button>
          </div>
        </form>
      </div>
      {isModalOpen && (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 11,
            }}
          >
            <TrainingPlan
              onClose={() => setIsModalOpen(false)}
              CustomerName={formData.Name}
              CustomerSurname={formData.Surname}
            />
          </Box>
        )}
    </div>
  );
}
