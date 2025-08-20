import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const UploadExam = () => {
  const { courseId } = useParams();
  const { backendUrl } = useContext(AppContext);

  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctOption: 0 },
  ]);

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOption = parseInt(value);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctOption: 0 },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedQuestions = questions.map((q) => ({
      questionText: q.questionText,
      options: q.options.map((opt) => ({ text: opt })),
      correctOption: q.correctOption,
    }));

    try {
      const response = await axios.post(`${backendUrl}/api/course/upload/${courseId}`, {
        questions: formattedQuestions,
      });

      if (response.data.success) {
        toast.success("Exams uploaded successfully!");
        setQuestions([{ questionText: "", options: ["", "", "", ""], correctOption: 0 }]);
      } else {
        toast.error(response.data.message || "Failed to upload assignment");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Exams</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="bg-white shadow-md rounded-xl p-5 space-y-4 border border-gray-200"
          >
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 font-medium"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt, optIndex) => (
                <div
                  key={optIndex}
                  className="flex items-center bg-gray-50 rounded-lg p-2 px-3 shadow-sm"
                >
                  <input
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    required
                  />
                  <label className="ml-3 flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctOption === optIndex}
                      onChange={() => handleCorrectOptionChange(qIndex, optIndex)}
                      className="w-4 h-4 text-blue-500 accent-blue-500 focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="ml-2 text-gray-600 text-sm">Correct</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-lg shadow-md"
          >
            Add Question
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-6 py-3 rounded-lg shadow-md"
          >
            Upload Exams
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadExam;
