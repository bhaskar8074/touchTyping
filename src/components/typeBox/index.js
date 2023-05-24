import React, { useState, useEffect } from "react";
import "./index.css";

const keyboardKeys = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];

const TypingBox = () => {
  const [randomString, setRandomString] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [accuracy, setAccuracy] = useState(100);
  const [activeKey, setActiveKey] = useState();
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState("00:00");
  const [totalkeys, setTotalKeys] = useState(0);
  const [totalCorrectKeys, setTotalCorrectKeys] = useState(0);
  const [timeCompleted, setTimeCompleted] = useState(false);

  useEffect(() => {
    generateRandomString();
  }, []);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60)
          .toString()
          .padStart(2, "0");
        const seconds = (elapsedTime % 60).toString().padStart(2, "0");
        setTimer(`${minutes}:${seconds}`);

        if (elapsedTime >= 300) {
          clearInterval(interval);
          setStartTime(null);
          setTimeCompleted(true);
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  const generateRandomString = () => {
    const randomLength = Math.floor(Math.random() * 5) + 6; // Random length between 6 and 10
    let randomStr = "";

    for (let i = 0; i < randomLength; i++) {
      const randomIndex = Math.floor(Math.random() * keyboardKeys.length);
      randomStr += keyboardKeys[randomIndex];
    }

    setRandomString(randomStr);
    setActiveKey(randomStr[0]);
  };

  const handleStart = () => {
    setStartTime(Date.now());
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
    setActiveKey(randomString[inputValue.length]);

    if (inputValue.length === randomString.length) {
      calculateAccuracy();
      setInputValue("");
      generateRandomString();
      setTotalKeys(totalkeys + randomString.length);
    }
  };

  const calculateAccuracy = () => {
    let count = 1;

    for (let i = 0; i < randomString.length; i++) {
      if (randomString[i] === inputValue[i]) {
        count++;
      }
    }
    const totalCharacters = randomString.length;

    setTotalCorrectKeys(totalCorrectKeys + count);
    const accuracyPercentage = (count / totalCharacters) * 100;
    setAccuracy(accuracyPercentage.toFixed(2));
  };

  return (
    <div className="bg-container">
      <div>
        <p className="stats-accuracy">{timer}</p>
      </div>
      <div>
        <p className="random-string">{randomString}</p>
      </div>
      <div className="input-container">
        <input
          className="input-field"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleStart}
        />
      </div>
      <div className="keys-container">
        {keyboardKeys.map((eachItem) => (
          <div
            className={`key-btn ${eachItem === activeKey ? "active" : ""}`}
            key={eachItem}
          >
            <p>{eachItem}</p>
          </div>
        ))}
      </div>
      <div className="stats-container">
        <p className="stats-accuracy">Accuracy: {accuracy}%</p>
        <p className="stats-accuracy">
          total correct keys pressed: {totalCorrectKeys}/{totalkeys}{" "}
        </p>
        {timeCompleted && (
          <p className="stats-accuracy">
            overall accuracy in 5 mins:{" "}
            {((totalCorrectKeys / totalkeys) * 100).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

export default TypingBox;
