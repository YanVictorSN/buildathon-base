//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import { Counters } from "@openzeppelin/contracts/utils/Counters.sol";

/**
 * A multiplayer quiz game contract that allows players to stake Ether to play
 * It also allows the owner to withdraw the Ether in the contract
 * @author @YanVictorSN
 */
contract QuizGame {
	mapping(address => uint256) playerBalances;
	uint256[] public players;
	uint256 public maxPlayersPerMatch;
	uint256 public stakeValue;
	bool public gameBegun;
	using Counters for Counters.Counter;
	Counters.Counter private numberOfPlayers;

	event playerJoined(address indexed player, uint256 amount);
	event newStakeValue(uint256 newStakeValue);
	event playerUnstaked(address indexed player, uint256 amount);
	event gameStarted(uint256 maxPlayersPerMatch, uint256 timestamp);

	error PlayerAlreadyJoined();
	error InsufficientBalanceToPlay();
	error GameAlreadyBegun();
	error TotalPlayerPerMatchReached();

	/// @notice Constructor to set the initial stake value
	/// @param _stakeValue The amount of Ether required to stake
	constructor(uint256 _stakeValue, uint256 _maxPlayersPerMatch) {
		stakeValue = _stakeValue;
		maxPlayersPerMatch = _maxPlayersPerMatch;
	}

	modifier isGameNotBegun() {
		if (gameBegun) {
			revert GameAlreadyBegun();
		}
		_;
	}

	/// @notice Stake Ether to play the game
	/// @dev Players can only stake once
	function stakeToPlay() public payable isGameNotBegun {
		if (playerBalances[msg.sender] > 0) revert PlayerAlreadyJoined();
		if (msg.value < stakeValue) revert InsufficientBalanceToPlay();
		numberOfPlayers.increment();
		if (numberOfPlayers.current() == maxPlayersPerMatch) {
			gameBegun = true;
			emit gameStarted(maxPlayersPerMatch, block.timestamp);
		}
		playerBalances[msg.sender] += msg.value;
		emit playerJoined(msg.sender, msg.value);
	}

	/// @notice Unstake Ether before the game starts
	/// @dev Players can only unstake if they have staked
	function unStake() public isGameNotBegun {
		if (playerBalances[msg.sender] < stakeValue)
			revert PlayerAlreadyJoined();
		numberOfPlayers.decrement();
		playerBalances[msg.sender] = 0;
		payable(msg.sender).transfer(stakeValue);
		emit playerUnstaked(msg.sender, stakeValue);
	}

	/// @notice Set the stake value required to play the game
	/// @param _newStakeValue The new stake value
	function setStakeValue(uint256 _newStakeValue) public {
		stakeValue = _newStakeValue;
		emit newStakeValue(_newStakeValue);
	}

	/// @notice Get the players in this match
	function getPlayers() public view returns (uint256[] memory) {
		return players;
	}

	/// @notice Get the number of players in this match
	function getNumberOfPlayers() public view returns (uint256) {
		return numberOfPlayers.current();
	}
}
