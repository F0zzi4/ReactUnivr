import { useState } from "react";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import { Typography, Alert, Chip } from "@mui/material";

interface FormData {
  Name: string;
  Surname: string;
  DateOfBirth: string;
  Height: number;
  Weight: number;
  Limitations: string;
  GymLevel: string;
}

export default function Me() {
  const [isEditing, setIsEditing] = useState(false);
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [formData, setFormData] = useState<FormData>({
    Name: user?.Name || "",
    Surname: user?.Surname || "",
    DateOfBirth: user?.DateOfBirth || "",
    Height: user?.Height || 0,
    Weight: user?.Weight || 0,
    Limitations: user?.Limitations || "",
    GymLevel: user?.GymLevel || "",
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorFields, setErrorFields] = useState<Set<string>>(new Set());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Height" || name === "Weight" ? Number(value) : value,
    }));
  };

  const saveChanges = () => {
    // Validation required fields
    const fieldsWithErrors = new Set<string>();
    if (!formData.Name) fieldsWithErrors.add("Name");
    if (!formData.Surname) fieldsWithErrors.add("Surname");
    if (!formData.DateOfBirth) fieldsWithErrors.add("DateOfBirth");
    if (formData.Height <= 0) fieldsWithErrors.add("Height");
    if (formData.Weight <= 0) fieldsWithErrors.add("Weight");

    if (fieldsWithErrors.size > 0) {
      setErrorMessage("Please fill all required fields.");
      setErrorFields(fieldsWithErrors);
      return;
    }

    // Reset error messages and fields if there are no errors
    setErrorMessage("");
    setErrorFields(new Set());

    if (user) {
      const updatedUser = { ...user, ...formData };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      FirestoreInterface.updateUser(updatedUser);
    }
    setIsEditing(false);
  };

  // Determine the color based on GymLevel
  const gymLevelColor = {
    Beginner: "#FF6F61",
    Intermediate: "#88D8B0",
    Advanced: "#5F4B8B",
  }[formData.GymLevel];

  // Helper function to determine if a field has an error
  const hasError = (fieldName: string) => errorFields.has(fieldName);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        className="w-full max-w-lg md:max-w-2xl p-6 md:p-8 shadow-xl rounded-xl bg-white"
        style={{ backgroundColor: "white" }}
      >
        {/* Title and GymLevel Chip */}
        <div className="flex flex-col items-center mb-6">
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 3,
              textAlign: "center",
              color: "#333",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
              background:
                "linear-gradient(to right,rgb(50, 197, 112),rgb(30, 129, 71))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Personal Info
          </Typography>
          <Chip
            label={formData.GymLevel ? formData.GymLevel : "Beginner"}
            sx={{
              backgroundColor: formData.GymLevel
                ? gymLevelColor
                : formData.GymLevel,
              color: "white",
              fontWeight: "bold",
              padding: "8px 16px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* NickName */}
        <div className="mb-5">
          <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
            Nick Name
          </label>
          <input
            className={`appearance-none block w-full bg-gray-100 text-gray-700 border ${
              hasError("id") ? "border-red-500" : "border-gray-300"
            } rounded py-4 px-5 leading-tight focus:outline-none`}
            type="text"
            value={user?.id || ""}
            readOnly
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
            Email
          </label>
          <input
            className={`appearance-none block w-full bg-gray-100 text-gray-700 border ${
              hasError("Email") ? "border-red-500" : "border-gray-300"
            } rounded py-4 px-5 leading-tight focus:outline-none`}
            type="email"
            value={user?.Email || ""}
            readOnly
          />
        </div>

        {/* Nome e Cognome */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              First Name
            </label>
            <input
              className={`appearance-none block w-full bg-white text-gray-700 border ${
                hasError("Name") ? "border-red-500" : "border-gray-300"
              } rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white`}
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Last Name
            </label>
            <input
              className={`appearance-none block w-full bg-white text-gray-700 border ${
                hasError("Surname") ? "border-red-500" : "border-gray-300"
              } rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white`}
              type="text"
              name="Surname"
              value={formData.Surname}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        {/* Date of birth */}
        <div className="mb-5">
          <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
            Date of Birth
          </label>
          <input
            className={`appearance-none block w-full bg-white text-gray-700 border ${
              hasError("DateOfBirth") ? "border-red-500" : "border-gray-300"
            } rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white`}
            type="date"
            name="DateOfBirth"
            value={formData.DateOfBirth}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>

        {/* Height & Weight */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Height (cm)
            </label>
            <input
              className={`appearance-none block w-full bg-white text-gray-700 border ${
                hasError("Height") ? "border-red-500" : "border-gray-300"
              } rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white`}
              type="number"
              name="Height"
              value={formData.Height}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Weight (kg)
            </label>
            <input
              className={`appearance-none block w-full bg-white text-gray-700 border ${
                hasError("Weight") ? "border-red-500" : "border-gray-300"
              } rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white`}
              type="number"
              name="Weight"
              value={formData.Weight}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        {/* Limitations */}
        <div className="mb-5">
          <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
            Limitations (Optional)
          </label>
          <textarea
            className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
            name="Limitations"
            value={formData.Limitations}
            onChange={handleChange}
            readOnly={!isEditing}
            maxLength={200}
            rows={4}
          />
        </div>

        {/* Error message */}
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2, boxShadow: 1 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Save / Edit Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => {
              isEditing ? saveChanges() : setIsEditing(!isEditing);
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-7 rounded-md text-lg"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </form>
    </div>
  );
}
