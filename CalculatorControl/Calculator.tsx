import { evaluate } from "mathjs";
import * as React from "react";

interface ICalculatorProps {
  onResultChange: (value: number) => void;
}

const Calculator: React.FC<ICalculatorProps> = ({ onResultChange }) => {
  const [input, setInput] = React.useState("");

  // Handle button click events
  const handleClick = (value: string) => {
    // For multiplication and division, append the operator correctly
    if (value === "×") {
      setInput((prev) => prev + "*"); // Add multiplication operator as "*"
    } else if (value === "÷") {
      setInput((prev) => prev + "/"); // Add division operator as "/"
    } else {
      setInput((prev) => prev + value);
    }
  };

  // Clear the entire input
  const clearInput = () => {
    setInput("");
  };

  // Clear last entered value
  const deleteLastNumber = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  // Perform the calculation for the entered expression
  const calculateResult = () => {
    try {
      // Ensure input has the correct format and remove unwanted characters
      const sanitizedInput = input.replace(/[^-()\d/*+.x^%√]/g, "").trim();

      // Evaluate the sanitized input using mathjs
      const result = evaluate(sanitizedInput);

      // Set the result and pass it to the parent component
      setInput(result.toString());
      onResultChange(result);
    } catch (error) {
      // Handle errors in evaluation (e.g., malformed input)
      setInput("Error");
    }
  };

  // Handle special operations like square root, reciprocal, etc.
  const handleSpecialOperation = (operation: string) => {
    try {
      switch (operation) {
        case "1/x":
          setInput((prev) => (prev ? (1 / parseFloat(prev)).toString() : ""));
          onResultChange(1 / parseFloat(input));
          break;
        case "x²":
          setInput((prev) => (prev ? (Math.pow(parseFloat(prev), 2)).toString() : ""));
          onResultChange(Math.pow(parseFloat(input), 2));
          break;
        case "√":
          setInput((prev) => (prev ? Math.sqrt(parseFloat(prev)).toString() : ""));
          onResultChange(Math.sqrt(parseFloat(input)));
          break;
        case "±":
          setInput((prev) => (prev ? (-parseFloat(prev)).toString() : ""));
          break;
        case "%":
          setInput((prev) => (prev ? (parseFloat(prev) / 100).toString() : ""));
          onResultChange(parseFloat(input) / 100);
          break;
        default:
          break;
      }
    } catch (error) {
      setInput("Error");
    }
  };

  return (
    <div style={containerStyle}>
      {/* Input Display */}
      <div style={inputDisplayStyle}>{input || "0"}</div>

      {/* Calculator Buttons */}
      <div style={buttonsGridStyle}>
        {/* First Row */}
        {["%", "CE", "C", "delete_last_number"].map((btn) => (
          <button
            key={btn}
            onClick={
              btn === "C" ? clearInput :
              btn === "CE" ? clearInput :
              btn === "delete_last_number" ? deleteLastNumber :
              () => handleSpecialOperation(btn)
            }
            style={buttonStyle}
          >
            {btn === "delete_last_number" ? "⌫" : btn}
          </button>
        ))}

        {/* Second Row */}
        {["1/x", "x²", "√", "÷"].map((btn) => (
          <button
            key={btn}
            onClick={() => handleSpecialOperation(btn)}
            style={buttonStyle}
          >
            {btn}
          </button>
        ))}

        {/* Third Row */}
        {["7", "8", "9", "×"].map((btn) => (
          <button key={btn} onClick={() => handleClick(btn)} style={buttonStyle}>
            {btn}
          </button>
        ))}

        {/* Fourth Row */}
        {["4", "5", "6", "-"].map((btn) => (
          <button key={btn} onClick={() => handleClick(btn)} style={buttonStyle}>
            {btn}
          </button>
        ))}

        {/* Fifth Row */}
        {["1", "2", "3", "+"].map((btn) => (
          <button key={btn} onClick={() => handleClick(btn)} style={buttonStyle}>
            {btn}
          </button>
        ))}

        {/* Last Row */}
        {["±", "0", ".", "="].map((btn) => (
          <button
            key={btn}
            onClick={
              btn === "=" ? calculateResult :
              btn === "±" ? () => handleSpecialOperation(btn) :
              btn === "." ? () => handleClick(btn) :
              () => handleClick(btn)
            }
            style={btn === "=" ? { ...buttonStyle, backgroundColor: "#00b8d4" } : buttonStyle}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

// Container style
const containerStyle: React.CSSProperties = {
  width: "350px",
  padding: "20px",
  background: "#1c1c1c",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
  fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "550px",
};

// Input display style
const inputDisplayStyle: React.CSSProperties = {
  fontSize: "30px",
  textAlign: "right",
  color: "#fff",
  backgroundColor: "#333",
  padding: "10px 20px",
  borderRadius: "8px",
  marginBottom: "20px",
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
};

// Grid layout for buttons
const buttonsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "10px",
};

// Button style
const buttonStyle: React.CSSProperties = {
  padding: "20px",
  fontSize: "20px",
  backgroundColor: "#2a2a2a",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

export default Calculator;