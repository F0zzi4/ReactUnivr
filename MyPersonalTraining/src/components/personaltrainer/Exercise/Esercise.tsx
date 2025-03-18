import { useState, useEffect } from "react";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

interface FormData {
  id: string;
  Description: string;
  Difficulty: number;
  Name: string;
  Target: string;
}

export default function Exercise() {
  // State for editing mode, form data, and error messages
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    Description: "",
    Name: "",
    Difficulty: 0,
    Target: "",
  });
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  const exercise = location.state?.exercise;

  // Set initial form data when exercise is loaded
  useEffect(() => {
    if (exercise) {
      setFormData({
        id: exercise.id,
        Description: exercise.Description,
        Name: exercise.Name,
        Difficulty: exercise.Difficulty,
        Target: exercise.Target,
      });
    }
  }, [exercise]); // Only re-run if exercise data changes

  // Handle input changes (text input, select, textarea)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "Difficulty" ? Number(value) : value,
    }));
  };

  // Handle difficulty change
  const handleDifficultyChange = (difficulty: number) => {
    if (!isEditing) return; // Prevent changing difficulty if not editing
    setFormData((prev) => ({
      ...prev,
      Difficulty: difficulty,
    }));
  };

  // Save the updated exercise data
  const saveChanges = () => {
    if (!formData.Name || !formData.Description || !formData.Target) {
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

    // Update the exercise
    const updatedExercise = { ...exercise, ...formData };
    FirestoreInterface.updateExercises(updatedExercise);

    // Exit editing mode
    setIsEditing(false);
  };

  // Show message if exercise is not selected
  if (!exercise) {
    return <p>No exercise selected.</p>;
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="w-11/12 max-w-2xl bg-white p-10 shadow-xl rounded-xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-green-600 mb-6 transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2 hover:text-green-600 transition-colors duration-200" />
          <span className="font-semibold">Back</span>
        </button>

        {/* Form */}
        <form className="space-y-4">
          {/* Exercise Id */}
          <div>
            <label className="block font-semibold">Exercise Name</label>
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              readOnly={!isEditing} // Disable if not editing
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
              readOnly={!isEditing} // Disable if not editing
              disabled={!isEditing} // Disable if not editing
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
                  disabled={!isEditing} // Disable if not editing
                >
                  <span className="text-white font-bold">{level}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target */}
          <div>
            <label className="block font-semibold">Target</label>
            <select
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
              name="Target"
              value={formData.Target}
              onChange={handleChange}
              disabled={!isEditing} // Disable if not editing
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

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Modify/Save Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                if (isEditing) saveChanges(); // Save changes if editing
                setIsEditing(!isEditing); // Toggle editing mode
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-md text-lg"
              disabled={error !== ""} // Disable if error exists
            >
              {isEditing ? "Save" : "Edit"}{" "}
              {/* Toggle text based on edit mode */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
