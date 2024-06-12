// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createServer } = require("http");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const questions = [];
let currentQuestionIndex = 0;
let matchCreated = false;
let startQuestions = false;

// Fetch questions from the API,
async function fetchQuestions() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=5");
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    const data = await response.json();
    console.log(data);
    questions.push(...data.results);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Sent questions one by one to all connected clients after the interval
async function sendQuestionToAll() {
  console.log("sendQuestionToAll", currentQuestionIndex);
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    io.emit("question", question);
    currentQuestionIndex++;
  } else if (currentQuestionIndex === questions.length) {
    clearInterval(questionInterval);
    matchCreated = false;
    startQuestions = false;
    io.emit("gameOver");
  }
}

// Handle incoming connections
io.on("connection", async socket => {
  // When the match is created, set the gameState true for all clients
  socket.once("matchCreated", () => {
    if (!matchCreated) {
      console.log("matchCreated Socket");
      matchCreated = true;
      gameStarted = true;
      io.emit("gameState", { gameStarted });
    }
  });
  // When startQuestions is received, start sending questions to all clients
  socket.once("startQuestions", () => {
    if (!startQuestions) {
      console.log("startQuestions");
      startQuestions = true;
      questionInterval = setInterval(sendQuestionToAll, 5000);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Fech questions from the API when the server starts
fetchQuestions();

httpServer.listen(5000, () => {
  console.log("listening on *:5000");
});
