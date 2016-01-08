// Your goal is to create a command line game, where users
// guess a randomly generated number between 1-100 until 
// they have guessed correctly. 

// You'll need to npm install prompt
var prompt = require('prompt');
// example of using prompt
var randomNumber = Math.floor((Math.random() * 100) + 1);
console.log(randomNumber);
 // fix this to be random

// Create a game, where users can guess until they guess correctly.

function guessingGame(){
	
	prompt.get(['guess'], function (err, result) {
		console.log(result);
		console.log(result.guess);
		var globalGuess = result.guess;
	});
	if(globalGuess === randomNumber){
		console.log("Nice work");
	}else {
		console.log("You have to try again");
		guessingGame();
	}

}

guessingGame();