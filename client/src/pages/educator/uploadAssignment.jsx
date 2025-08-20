import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UploadAssignment = () => {
  const [questions, setQuestions] = useState(['']); 
  const [deadline, setDeadline] = useState(''); // new state for deadline
  const { backendUrl } = useContext(AppContext);
  const { courseId } = useParams();

  const handleAddQuestion = () => {
    setQuestions([...questions, '']);
  };

  const handleChangeQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Assignment Questions:', questions, 'Deadline:', deadline);

    try {
      await axios.post(`${backendUrl}/api/course/upload-assignment`, { courseId, questions, deadline });
      alert('Assignment uploaded successfully!');
    } catch (error) {
      console.log(error);
      alert('Failed to upload assignment');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Assignment</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-1 font-medium">
              Question {index + 1}
            </label>
            <textarea
              value={q}
              onChange={(e) => handleChangeQuestion(index, e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your question"
              rows={3}
            />
          </div>
        ))}

        {/* Deadline Field */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Deadline</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="button"
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
        >
          Add More
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Assignment
        </button>
      </form>
    </div>
  );
};

export default UploadAssignment;
