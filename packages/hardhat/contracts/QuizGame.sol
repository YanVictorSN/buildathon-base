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
	using Counters for Counters.Counter;
	struct PlayerData {
		address playerAddress;
		uint256 playerBalance;
		uint256 playerMatchTime;
		uint256 playerScore;
		uint256 playerLevel;
		bool playerIsOut;
	}

	struct MatchData {
		uint256 matchId;
		uint256 matchTimestamp;
		address[] players;
	}

	mapping(address => PlayerData) playerData;
	mapping(uint256 => MatchData) matches;
	uint256[] public matchIds;
	address[] public players;
	uint256 public maxPlayersPerMatch;
	uint256 public maxLevels;
	uint256 public stakeValue;
	bool public gameBegun;

	Counters.Counter private numberOfPlayers;
	Counters.Counter private numberOfMatches;

	event PlayerJoined(address indexed player, uint256 amount);
	event NewStakeValue(uint256 newStakeValue);
	event PlayerUnstaked(address indexed player, uint256 amount);
	event GameStarted(uint256 maxPlayersPerMatch, uint256 timestamp);
	event MatchCreated(uint256 matchId, uint256 timestamp);
	event GameIsOver(address indexed winner);

	error PlayerAlreadyJoined();
	error InsufficientBalanceToPlay();
	error GameAlreadyBegun();
	error TotalPlayerPerMatchReached();
	error PlayerAlreadyLoseTheMatch();
	error MatchIsNotStarted();
	error PlayerIsNotInMatch();
	error PlayerDidNotAnswerInTime();

	/// @notice Constructor to set the initial stake value
	/// @param _stakeValue The amount of Ether required to stake
	constructor(
		uint256 _stakeValue,
		uint256 _maxPlayersPerMatch,
		uint256 _maxLevels
	) {
		stakeValue = _stakeValue;
		maxPlayersPerMatch = _maxPlayersPerMatch;
		maxLevels = _maxLevels;
	}

	modifier isGameNotBegun() {
		if (gameBegun) {
			revert GameAlreadyBegun();
		}
		_;
	}

	modifier isMatchStarted() {
		if (!gameBegun) {
			revert MatchIsNotStarted();
		}
		_;
	}

	modifier isPlayerOut() {
		if (playerData[msg.sender].playerIsOut) {
			revert PlayerAlreadyLoseTheMatch();
		}
		_;
	}

	modifier isPlayerInMatch() {
		if (playerData[msg.sender].playerAddress != msg.sender) {
			revert PlayerIsNotInMatch();
		}
		_;
	}

	modifier isAnswerInTime() {
		if (
			playerData[msg.sender].playerMatchTime + 5 seconds < block.timestamp
		) {
			revert PlayerDidNotAnswerInTime();
		}
		_;
	}

	function _createMatch() private {
		uint256 matchId = numberOfMatches.current();
		address[] memory matchPlayers = players;
		matches[matchId] = MatchData({
			matchId: matchId,
			matchTimestamp: 0,
			players: matchPlayers
		});
		gameBegun = true;
		setThePlayersTime(matchId);
		emit MatchCreated(matchId, block.timestamp);
	}

	function setThePlayersTime(uint256 _matchIdTime) public {
		for (uint i = 0; i < players.length; i++) {
			playerData[players[i]].playerMatchTime =
				block.timestamp +
				10 seconds;
		}
		matches[_matchIdTime].matchTimestamp = block.timestamp + 10 seconds;
		delete players;
	}

	/// @notice Stake Ether to play the game
	/// @dev Players can only stake once
	function stakeToPlay() public payable isGameNotBegun {
		if (playerData[msg.sender].playerBalance > 0)
			revert PlayerAlreadyJoined();
		if (msg.value < stakeValue) revert InsufficientBalanceToPlay();

		playerData[msg.sender] = PlayerData({
			playerAddress: msg.sender,
			playerBalance: msg.value,
			playerMatchTime: 0,
			playerScore: 0,
			playerLevel: 0,
			playerIsOut: false
		});

		players.push(msg.sender);
		numberOfPlayers.increment();
		if (players.length == maxPlayersPerMatch) {
			_createMatch();
		}
		emit PlayerJoined(msg.sender, msg.value);
	}

	/// @notice Unstake Ether before the game starts
	/// @dev Players can only unstake if they have staked
	function unStake() public isGameNotBegun {
		if (playerData[msg.sender].playerBalance < stakeValue)
			revert PlayerAlreadyJoined();
		uint256 balance = playerData[msg.sender].playerBalance;
		playerData[msg.sender].playerBalance = 0;
		numberOfPlayers.decrement();
		uint256 currentMatchId = numberOfMatches.current() - 1;

		address[] storage matchPlayers = matches[currentMatchId].players;
		for (uint256 i = 0; i < matchPlayers.length; i++) {
			if (matchPlayers[i] == msg.sender) {
				matchPlayers[i] = matchPlayers[matchPlayers.length - 1];
				matchPlayers.pop();
				break;
			}
		}

		payable(msg.sender).transfer(balance);
		emit PlayerUnstaked(msg.sender, stakeValue);
	}

	/// @notice Set the stake value required to play the game
	/// @param _newStakeValue The new stake value
	function setStakeValue(uint256 _newStakeValue) public {
		stakeValue = _newStakeValue;
		emit NewStakeValue(_newStakeValue);
	}

	/// @notice Increase the player score for a correct answer
	function checkAnswer(
		bool _isCorrect
	) public isPlayerOut isMatchStarted isPlayerInMatch isAnswerInTime {
		if (_isCorrect) {
			answerIsValid();
		} else {
			answerIsNotValid();
		}
	}

	function answerIsValid() private {
		playerData[msg.sender].playerScore++;
		playerData[msg.sender].playerLevel++;
		playerData[msg.sender].playerMatchTime = block.timestamp + 5 seconds;
		if (playerData[msg.sender].playerLevel >= maxLevels) {
			endMatch(msg.sender);
		}
	}

	/// @notice Set the player as out for an incorrect answer
	function answerIsNotValid() private {
		playerData[msg.sender].playerIsOut = true;
		playerData[msg.sender].playerBalance = 0;
	}

	function endMatch(address _winnerAddress) private {
		payable(_winnerAddress).transfer(address(this).balance);
		gameBegun = false;
		emit GameIsOver(_winnerAddress);
	}

	/// @notice Set the maximum number of players per match
	function setMaxPlayersPerMatch(uint256 _maxPlayersPerMatch) public {
		maxPlayersPerMatch = _maxPlayersPerMatch;
	}

	/// @notice Get the players in this match
	function getPlayers() public view returns (address[] memory) {
		return players;
	}

	function getMatchPlayers(
		uint256 _matchId
	) public view returns (address[] memory) {
		return matches[_matchId].players;
	}

	function getMatch(uint256 _matchId) public view returns (MatchData memory) {
		return matches[_matchId];
	}

	function getPlayerData(
		address _player
	) public view returns (PlayerData memory) {
		return playerData[_player];
	}
}
