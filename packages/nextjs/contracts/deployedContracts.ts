/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    QuizGame: {
      address: "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9",
      abi: [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_stakeValue",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_maxPlayersPerMatch",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "GameAlreadyBegun",
          type: "error",
        },
        {
          inputs: [],
          name: "InsufficientBalanceToPlay",
          type: "error",
        },
        {
          inputs: [],
          name: "MatchIsNotStarted",
          type: "error",
        },
        {
          inputs: [],
          name: "PlayerAlreadyJoined",
          type: "error",
        },
        {
          inputs: [],
          name: "PlayerAlreadyLoseTheMatch",
          type: "error",
        },
        {
          inputs: [],
          name: "PlayerIsNotInMatch",
          type: "error",
        },
        {
          inputs: [],
          name: "TotalPlayerPerMatchReached",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "maxPlayersPerMatch",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
          ],
          name: "GameStarted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "matchId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
          ],
          name: "MatchCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "newStakeValue",
              type: "uint256",
            },
          ],
          name: "NewStakeValue",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "player",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "PlayerJoined",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "player",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "PlayerUnstaked",
          type: "event",
        },
        {
          inputs: [],
          name: "answerIsCorrect",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "answerIsIncorrect",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "gameBegun",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_matchId",
              type: "uint256",
            },
          ],
          name: "getMatch",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "matchId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "matchTimestamp",
                  type: "uint256",
                },
                {
                  internalType: "address[]",
                  name: "players",
                  type: "address[]",
                },
              ],
              internalType: "struct QuizGame.MatchData",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_matchId",
              type: "uint256",
            },
          ],
          name: "getMatchPlayers",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_player",
              type: "address",
            },
          ],
          name: "getPlayerData",
          outputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "playerAddress",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "playerBalance",
                  type: "uint256",
                },
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "_value",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct Counters.Counter",
                  name: "playerScore",
                  type: "tuple",
                },
                {
                  internalType: "bool",
                  name: "playerIsOut",
                  type: "bool",
                },
              ],
              internalType: "struct QuizGame.PlayerData",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getPlayers",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "matchIds",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "maxMatchs",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "maxPlayersPerMatch",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "players",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_maxPlayersPerMatch",
              type: "uint256",
            },
          ],
          name: "setMaxPlayersPerMatch",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_newStakeValue",
              type: "uint256",
            },
          ],
          name: "setStakeValue",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "stakeToPlay",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "stakeValue",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "unStake",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
