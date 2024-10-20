import { createContext, useState } from "react";
import run from "../config/ayu";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Function to delay the display of words
  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput(""); // Clear input when starting a new chat
    setResultData(""); // Clear result data
  };

  // Function to handle sending the prompt and displaying results
  const onSent = async (prompt) => {
    setResultData(""); // Clear previous result
    setLoading(true);
    setShowResult(true);
    try {
      let response;

      if (prompt) {
        setRecentPrompt(prompt); // Update recent prompt
        response = await run(prompt); // Fetch response from run function
      } else {
        setPrevPrompt((prev) => [...prev, input]); // Save current input to prevPrompt
        setRecentPrompt(input); // Store current input as recentPrompt
        response = await run(input); // Fetch response using current input
      }

      let responseArray = response.split("**");
      let newResponse = ""; // Initialize empty string to accumulate the formatted response

      // Formatting logic: Add <b> tags to even-indexed segments
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 0) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }

      // Replacing '*' with line breaks
      let newResponse2 = newResponse.split("*").join("</br>");
      let newResponseArray = newResponse2.split(" ");

      // Delayed rendering of each word in the response
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      // Optionally, you could set an error message in the state here
    } finally {
      setLoading(false); // Set loading to false once processing is done
      setInput(""); // Clear the input after sending
    }
  };

  // Context value to be provided
  const contextValue = {
    prevPrompt,
    setPrevPrompt,
    input,
    setRecentPrompt,
    recentPrompt,
    setInput,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    onSent,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
