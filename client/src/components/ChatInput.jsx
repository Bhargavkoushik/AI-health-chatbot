import React, { useState } from "react";

const ChatInput = ({ onSubmit }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);

  // Regex: allow a-z, A-Z, 0-9, spaces, and basic punctuation .,?!'":;()-
  const validInputRegex = /^[a-zA-Z0-9\s.,?!'":;()-]*$/;

  const handleChange = (e) => {
    setInput(e.target.value);
    if (error) setError(null); // Clear error on edit
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedInput = input.trim();

    if (trimmedInput.length === 0) {
      setError("Input cannot be empty or whitespace only.");
      return;
    }
    if (!validInputRegex.test(trimmedInput)) {
      setError("Input contains invalid characters. Only letters, numbers, and basic punctuation are allowed.");
      return;
    }

    setError(null);
    onSubmit(trimmedInput);
    setInput(""); // Clear input field after successful submit
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 w-full max-w-md mx-auto p-4">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Enter your health question..."
        className={`border p-3 rounded ${error ? "border-red-600" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        aria-label="Health query input"
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={input.trim().length === 0}
      >
        Submit
      </button>
    </form>
  );
};

export default ChatInput;