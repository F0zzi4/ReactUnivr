import { useState } from "react";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface dataForm {
  id: string;
  Description: string;
  Difficulty: number;
  Name: string;
  Target: string;
}

interface AddCustomerProps {
  onClose: () => void; // function used on closing window
}

export default function AddExercises({ onClose }: AddCustomerProps) {
  const [formData, setFormData] = useState<dataForm>({
    id: "",
    Description: "",
    Difficulty: 0,
    Name: "",
    Target: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "id") {
      setFormData((prev) => ({
        ...prev,
        id: value,
        Name: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "Difficulty" ? Number(value) : value,
      }));
    }
  };

  const handleDifficultyChange = (difficulty: number) => {
    setFormData((prev) => ({
      ...prev,
      Difficulty: difficulty,
    }));
  };

  const createExercise = () => {
    if (!formData.id || !formData.Description || !formData.Target) {
      setError("Please fill all required fields.");
      return;
    }

    if (formData.Difficulty < 0 || formData.Difficulty > 5) {
      setError("Difficulty must be between 0 and 5.");
      return;
    }

    if (formData.Description.length > 200) {
      setError("Description must be 200 characters or less.");
      return;
    }

    setError("");
    FirestoreInterface.createExercise(formData)
      .then(() => window.location.reload())
      .catch((err) => setError("Error: " + err.message));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Title & close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center flex-1 pl-10">
            Create Exercise
          </h2>
          <IconButton
            onClick={onClose}
            sx={{
              color: "rgb(252, 252, 252)",
              backgroundColor: "rgb(153, 27, 27)",
              p: 0.5, // Resize the button outline
              width: 32,
              height: 32,
              "&:hover": {
                backgroundColor: "rgb(200, 50, 50)",
              },
            }}
          >
            <Close sx={{ fontSize: 18 }} /> {/* Resize icon */}
          </IconButton>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Name of exercise */}
          <div>
            <label className="block font-semibold">Exercise Name</label>
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold">Description</label>
            <textarea
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              maxLength={200}
              rows={4}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.Description.length}/200 characters
            </p>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block font-semibold text-center">
              Difficulty
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleDifficultyChange(level)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    formData.Difficulty >= level
                      ? "bg-green-500"
                      : "bg-gray-200 hover:bg-green-300"
                  }`}
                >
                  <span className="text-white font-bold">{level}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target */}
          <div className="">
            <label className="block font-semibold">Target</label>
            <select
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
              name="Target"
              value={formData.Target}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select a target
              </option>
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Arms">Arms</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Legs">Legs</option>
              <option value="Abs">Abs</option>
            </select>
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Create button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={createExercise}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md text-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
