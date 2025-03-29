import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";

interface FormData {
  id: string;
  Email: string;
  Name: string;
  Surname: string;
  DateOfBirth: string;
  Height: number | "";
  Weight: number | "";
  UserType: string;
  Limitations: string;
  GymLevel: string;
}

export default function Customer() {
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [formData, setFormData] = useState<FormData>({
    id: customer?.id || "",
    Email: customer?.Email || "",
    Name: customer?.Name || "",
    Surname: customer?.Surname || "",
    DateOfBirth: customer?.DateOfBirth || "",
    Height: customer?.Height || "",
    Weight: customer?.Weight || "",
    UserType: customer?.UserType || "Customer",
    Limitations: customer?.Limitations || "",
    GymLevel: customer?.GymLevel || "",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [fieldErrors, setFieldErrors] = useState(new Set<string>());

  if (!customer) {
    return <p>No customer selected.</p>;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "Height" || name === "Weight"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleManagePlan = async () => {
    await FirestoreInterface.createTrainingPlan(user.id, formData.id);
    navigate("/personal-trainer/plan-management/training-plan", {
      state: formData,
    });
  };

  const validateForm = () => {
    const fieldsWithErrors = new Set<string>();

    // Check required fields and invalid values
    if (!formData.Name) fieldsWithErrors.add("Name");
    if (!formData.Surname) fieldsWithErrors.add("Surname");
    if (!formData.DateOfBirth) fieldsWithErrors.add("DateOfBirth");
    if (typeof formData.Height === "number" && formData.Height <= 0)
      fieldsWithErrors.add("Height");
    if (typeof formData.Weight === "number" && formData.Weight <= 0)
      fieldsWithErrors.add("Weight");
    if (!formData.GymLevel) fieldsWithErrors.add("GymLevel");

    setFieldErrors(fieldsWithErrors);
    return fieldsWithErrors.size === 0; // Return true if no errors
  };

  const toggleEdit = async () => {
    if (isEditable) {
      // Validate fields before saving
      if (!validateForm()) {
        setErrorMessage("Please fill all required fields correctly.");
        return;
      }

      try {
        await FirestoreInterface.updateUser(formData);
        setSuccessMessage("Changes saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Update error:", error);
        setErrorMessage("Error saving changes. Please try again.");
      }
    }

    setIsEditable(!isEditable);
    setErrorMessage(""); // Reset error messages
  };

  return (
    <div className="h-screen w-full flex items-center justify-center mt-10">
      <div className="w-11/12 max-w-2xl bg-white p-10 shadow-xl rounded-xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-green-600 hover:bg-green-100 mb-6 transition-colors duration-200 py-1 px-1 rounded-md"
        >
          <FaArrowLeft className="mr-2 hover:text-green-600 transition-colors duration-200" />
          <span className="font-semibold">Back</span>
        </button>

        <form>
          <h2 className="text-3xl font-bold mb-8 text-center">
            {formData.Name} {formData.Surname}'s Info
          </h2>
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
          {/* Name & Surname */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                First Name
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                  fieldErrors.has("Name") ? "border-red-500" : "border-gray-300"
                } rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white`}
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                Last Name
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                  fieldErrors.has("Surname")
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white`}
                type="text"
                name="Surname"
                value={formData.Surname}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
          </div>
          {/* Date of Birth */}
          <div className="mb-5">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Date of Birth
            </label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                fieldErrors.has("DateOfBirth")
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white`}
              type="date"
              name="DateOfBirth"
              value={formData.DateOfBirth}
              onChange={handleChange}
              readOnly={!isEditable}
            />
          </div>
          {/* Gym Level */}
          <div className="mb-5">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Gym Level
            </label>
            <select
              name="GymLevel"
              value={formData.GymLevel}
              onChange={handleChange}
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                fieldErrors.has("GymLevel")
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded py-4 px-5 leading-tight focus:outline-none`}
              disabled={!isEditable}
            >
              <option value="">Select Gym Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          {/* Limitations */}
          <div className="mb-5">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Limitations
            </label>
            <textarea
              name="Limitations"
              value={formData.Limitations}
              onChange={handleChange}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none"
              maxLength={200}
              placeholder="Describe any limitations..."
              readOnly={!isEditable}
            />
            <p className="text-sm text-gray-500">
              {formData.Limitations.length}/200
            </p>
          </div>
          {/* Error message */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}
          {/* Success message */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}
          <div className="mt-8 flex justify-center space-x-4">
            {/* Edit / Save Button */}
            <button
              type="button"
              onClick={toggleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-7 rounded-md text-lg"
            >
              {isEditable ? "Save Changes" : "Edit Info"}
            </button>

            {/* Manage Plan Button */}
            <button
              type="button"
              onClick={handleManagePlan}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-7 rounded-md text-lg"
            >
              Manage Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
