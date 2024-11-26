import { createContext, useState, useEffect } from "react";
import run from "../config/ayu"; // Your AI backend integration
import Prism from "prismjs"; // Prism for syntax highlighting
import "prismjs/themes/prism.css"; // Prism theme for code styling

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
    // Input validation
    if (!prompt && !input) {
      alert("Please enter a prompt.");
      return;
    }

    setResultData(""); // Clear previous result
    setLoading(true);
    setShowResult(true);

    try {
      let response;

      const currentPrompt = prompt || input;
      setRecentPrompt(currentPrompt); // Update recent prompt
      setPrevPrompt((prev) => [...prev, currentPrompt]); // Save current input

      response = await run(currentPrompt); // Fetch response using the current prompt

      // Detect code snippets wrapped in triple backticks (```).
      let responseArray = response.split("```");
      let formattedResponse = "";

      for (let i = 0; i < responseArray.length; i++) {
        if (i % 2 === 0) {
          // Regular text
          formattedResponse += responseArray[i];
        } else {
          // Code block (formatted with <pre><code>)
          formattedResponse += `<pre><code class="language-js">${responseArray[i]}</code></pre>`;
        }
      }

      // Replace '*' with line breaks and handle delayed rendering
      let formattedResponseWithBreaks = formattedResponse.split("*").join("</br>");
      let responseWords = formattedResponseWithBreaks.split(" ");

      // Delayed rendering of each word in the response
      for (let i = 0; i < responseWords.length; i++) {
        const nextWord = responseWords[i];
        delayPara(i, nextWord + " ");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      alert("There was an error fetching the response. Please try again."); // Notify user of error
    } finally {
      setLoading(false); // Set loading to false once processing is done
      setInput(""); // Clear the input after sending
    }
  };

  // Use Prism to highlight code blocks after resultData is updated
  useEffect(() => {
    Prism.highlightAll(); // Apply syntax highlighting on code blocks
  }, [resultData]);

  // Cleanup on unmount to clear timeouts
  useEffect(() => {
    return () => {
      // Clear any timeouts if necessary
    };
  }, []);

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
