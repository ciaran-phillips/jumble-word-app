class gameEngineService {
    
    constructor() {
        this.game = null;
    }
    
    newGame(wordDetails) {
        this.game = {
            score: 0,
            word: wordDetails,
            timeLeft: 40,
            userInput: "",
            previousInput: ""
        };
        return this.game;
    }

    updateGameScore(game) {
        const reduction = this._scoreReductionAmount(game.previousInput, game.userInput);
        game.previousInput = game.userInput;
        game.word.score = this._reduceScoreByAmount(game.word.score, reduction);
        
        if (game.word.original === game.userInput) {
            game.score += game.word.score;
        }
    }

    setNewWord(game, wordDetails) {
        game.word = wordDetails;
        game.userInput = "";
        game.previousInput = "";
    }

    isCorrect(game) {
        const input = this._normalize(game.userInput);
        return (game.word.original === input);
    }

    _scoreReductionAmount(previousInput, currentInput) {
        previousInput = this._normalize(previousInput);
        currentInput = this._normalize(currentInput);
        // If they've entered new characters, it doesn't reduce the score
        if (currentInput.length > previousInput.length) {
            return 0;
        }
        else {
            let i = 0;
            let earliestDivergence = previousInput.length;
            while (i < previousInput.length && earliestDivergence === previousInput.length) {
                if (i > currentInput.length || previousInput[i] !== currentInput[i]) {
                    earliestDivergence = i;
                }
                i++;
            }
            let reduction = previousInput.length - earliestDivergence;
            return reduction;
        }
    }

    _reduceScoreByAmount(currentScore, reduction) {
        const newScore = currentScore - reduction;
        return (newScore > 0) ? newScore : 0;
    };

    _normalize(txt) {
        return txt.toLowerCase().trim();
    }
}

module.exports = gameEngineService;
