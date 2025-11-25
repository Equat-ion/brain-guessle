import { WORDS } from "./words.js";

const MAX_GUESSES = 6;
let guessesRemaining = MAX_GUESSES;
let currentGuess = [];
let nextLetter = 0;

let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];

console.log(rightGuessString);

function initBoard() {
  let board = document.getElementById("gameBoard");

  for (let i = 0; i < MAX_GUESSES; i++) {
    let row = document.createElement("div");
    row.className = "letterRow";

    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letterBox";

      row.appendChild(box);
    }

    board.appendChild(row);
  }
}

function insertLetter(pressedKey) {
  if (nextLetter === 5) {
    return;
  }
  pressedKey = pressedKey.toLowerCase();

  let row = document.getElementsByClassName("letterRow")[6 - guessesRemaining];
  let box = row.children[nextLetter];

  box.textContent = pressedKey;
  box.classList.add("filled-box");

  currentGuess.push(pressedKey);
  nextLetter += 1;
}

function deleteLetter() {
  let row = document.getElementsByClassName("letterRow")[6 - guessesRemaining];
  let box = row.children[nextLetter - 1];

  box.textContent = "";
  box.classList.remove("filled-box");

  currentGuess.pop();
  nextLetter -= 1;
}

function checkGuess() {
  let row = document.getElementsByClassName("letterRow")[6 - guessesRemaining];
  let guessString = "";

  let rightGuess = Array.from(rightGuessString);

  for (const val of currentGuess) {
    guessString += val;
  }

  if (guessString.length != 5) {
    alert("not enough letters");
    return;
  }

  if (!WORDS.includes(guessString)) {
    alert("not in word list");
    return;
  }

  for (let i = 0; i < 5; i++) {
    let letterColor = "";
    let box = row.children[i];
    let letter = currentGuess[i]; 

    if (currentGuess[i] === rightGuessString[i]) { 
        letterColor = "green";
        rightGuess[i] = "#"; 
        
    } else if (!rightGuess.includes(currentGuess[i])) { 
        letterColor = "grey";
        
    // 3. CHECK FOR YELLOW (Letter is present, but NOT in this position)
    // The letter must be present in the (partially masked) rightGuess array
    } else {
        letterColor = "yellow";
        // Find the letter's position in the rightGuess array and mask it
        rightGuess[rightGuess.indexOf(currentGuess[i])] = "#";
    }

    // Apply delay and color
    let delay = 250 * i;
    setTimeout(() => {
        box.style.backgroundColor = letterColor;
        shadeKeyboard(currentGuess[i], letterColor);
    }, delay);
}
  
  if (guessString === rightGuessString) {
    setTimeout(() => {
        alert("You Guessed it right, game over")
    },1250)
    guessesRemaining = 0
    return
  }

  guessesRemaining -= 1
  currentGuess = []
  nextLetter = 0

  if (guessesRemaining === 0) {
    setTimeout(() => {
        alert("You have run out of moves!")
        alert(`game over, the right word was: "${rightGuessString}"`)
    },1250)
  }
}

function shadeKeyboard(letter, color) {
  for (const element of document.getElementsByClassName("keyboard-button")) {
    if (element.textContent === letter) {
      let oldColor = element.style.backgroundColor;
      if (oldColor === "green") {
        return;
      }
      if (oldColor === "yellow" && color !== "green") {
        return;
      }

      element.style.backgroundColor = color;
      break;
    }
  }
}

initBoard();

document.addEventListener("keyup", (e) => {
  if (guessesRemaining === 0) {
    return;
  }

  let pressedKey = String(e.key);

  if (pressedKey === "Backspace" && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  if (pressedKey === "Enter") {
    checkGuess();
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});
