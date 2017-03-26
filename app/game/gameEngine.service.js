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

    /**
     * Figure out whether the user has made a move that requires 
     * reducing the score for this word (i.e., if they have deleted or changed
     * characters that were already entered)
     * 
     * Reduces the score by 1 per backward move. If they have changed only a single
     * character, but it is 3 characters back in the word, then we subtract 3
     */
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
            // finds the first character that's different between the two strings
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