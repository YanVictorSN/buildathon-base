"use client";

import { useEffect, useState } from "react";
import { decode } from "html-entities";
import type { NextPage } from "next";
import { io } from "socket.io-client";
//import { Socket } from "socket.io-client";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
//import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWatchContractEvent, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface Question {
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const socket = io("http://localhost:5000");

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [gameStarted, setGameStarted] = useState(false);
  const [matchEvent, setMatchEvent] = useState(false);
  const [questionsEmitted, setQuestionsEmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const emitMatchCreatedEvent = () => {
    if (matchEvent) return;
    console.log("Entrou");
    socket.emit("matchCreated");
    setMatchEvent(true);
  };

  const [seconds, setSeconds] = useState(5);
  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);

      // Clean up the interval on component unmount
      return () => clearInterval(timer);
    }
  }, [seconds]);

  socket.on("gameState", gameState => {
    console.log("gameState", gameState);
    setGameStarted(gameState);
  });

  socket.on("gameOver", () => {
    console.log("Game Over");
    setGameOver(true);
  });

  socket.on("question", question => {
    console.log("Received question", question);
    setSeconds(5);
    setCurrentQuestion(question);
  });

  useEffect(() => {
    if (gameStarted && !questionsEmitted) {
      console.log("Questions emitted");
      socket.emit("startQuestions");
      setQuestionsEmitted(true);
    }
  }, [gameStarted, questionsEmitted]);

  useScaffoldWatchContractEvent({
    contractName: "QuizGame",
    eventName: "MatchCreated",
    onLogs: logs => {
      logs.forEach(log => {
        if (log.eventName === "MatchCreated") {
          console.log("MatchCreated", log.eventName);
          emitMatchCreatedEvent();
        }
      });
    },
  });

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("QuizGame");
  async function stakeToStart() {
    if (!connectedAddress) {
      alert("Please connect your wallet");
      return;
    }
    try {
      const tx = await writeYourContractAsync({
        functionName: "stakeToPlay",
        value: parseEther("0.2"),
      });
      console.log("tx", tx);
    } catch (e) {
      console.error("Error staking to start", e);
    }
  }

  const shuffleArray = (array: any) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    if (!currentQuestion) return;
    const allAnswers = new Set([...currentQuestion.incorrect_answers, currentQuestion.correct_answer]);
    setShuffledAnswers(shuffleArray(Array.from(allAnswers)));
  }, [currentQuestion]);

  const renderAnswers = () => {
    if (!currentQuestion) return null;
    return shuffledAnswers.map((answer: any, index: any) => (
      <button
        key={index}
        className={`btn btn-secondary ${
          answerResult === "correct" ? "bg-green-500" : answerResult === "incorrect" ? "bg-red-500" : ""
        }`}
        onClick={() => handleAnswerClick(answer)}
      >
        {decode(answer)}
      </button>
    ));
  };

  const [answerResult, setAnswerResult] = useState<"correct" | "incorrect" | null>(null);

  const handleAnswerClick = (selectedAnswer: any) => {
    const isCorrect = selectedAnswer === currentQuestion?.correct_answer;
    setAnswerResult(isCorrect ? "correct" : "incorrect");

    const checkAndProceed = async (isCorrect: boolean) => {
      try {
        const tx = await writeYourContractAsync({
          functionName: "checkAnswer",
          args: [isCorrect],
        });
        console.log("tx", tx);
      } catch (e) {
        console.error("Error checking answer", e);
      }
    };

    checkAndProceed(isCorrect);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnswerResult(null); // Reset answer result after a delay
    }, 2000); // Change this delay as per your preference

    return () => clearTimeout(timer); // Clean up timeout
  }, [answerResult]);

  function restartTheGame() {
    setGameStarted(false);
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        {!gameStarted ? (
          <div className="flex flex-col gap-5 items-center justify-center">
            <h1>Quiz Game</h1>
            <button onClick={stakeToStart} className="btn btn-primary">
              Stake to Start Game
            </button>
            <h3>Players Joined:</h3>
          </div>
        ) : gameOver ? (
          <div className="flex flex-col gap-5 items-center justify-center">
            <h1>Game Ended</h1>
            <h3>Thank you for playing!</h3>
            <button onClick={restartTheGame} className="btn btn-primary">
              Play Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 items-center justify-center">
            <h1>Game Started</h1>
            <h3>Counter </h3>
            <span className="countdown font-mono text-6xl">
              <span style={{ "--value": seconds } as any}></span>
            </span>
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="flex flex-col p-10">
                <div className="flex justify-center items-center gap-2">
                  <h2>Question:</h2>
                </div>
                <div className="flex flex-col gap-2">
                  <p>{decode(currentQuestion?.question)}</p>
                  {currentQuestion && <>{renderAnswers()}</>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
