"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
//import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWatchContractEvent, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [gameStarted, setGameStarted] = useState(false);
  const [questionsFetched, setQuestionsFetched] = useState(false);

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("QuizGame");

  useScaffoldWatchContractEvent({
    contractName: "QuizGame",
    eventName: "MatchCreated",
    onLogs: logs => {
      logs.map(log => {
        console.log("MatchCreated", log);
        setGameStarted(true);
      });
    },
  });

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

  useEffect(() => {
    async function getQuizQuestions() {
      const res = await fetch("https://opentdb.com/api.php?amount=10");
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      console.log(data);
      setQuestionsFetched(true);
    }

    if (gameStarted && !questionsFetched) {
      getQuizQuestions();
    }
  }, [gameStarted, questionsFetched]);

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
        ) : (
          <div className="flex flex-col gap-5 items-center justify-center">
            <h1>Game Started</h1>
            <h3>Counter </h3>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
