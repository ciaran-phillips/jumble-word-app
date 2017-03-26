class wordService {
    
    constructor(apiService) {
        this.apiService = apiService;
    }

    get(callback) {
        const self = this;
        const words = this.apiService.getWords(function processWordList(words) {
            const random = Math.floor(Math.random() * words.length);
            const word = words[random];
            const wordDetails = {
                original: word,
                jumbled: self._jumble(word),
                score: self._getScore(word)
            };
            
            callback(wordDetails);
        });
    }

    _jumble(word) {
        const chars = Array.from(word);
        for (let i = chars.length - 1; i > 0; i--) {
            // select a random element other than the one at i
            let random = Math.floor(Math.random() * (i + 1));
            // swap current with the random element
            [chars[i], chars[random]] = [chars[random], chars[i]];
        }
        return chars.join('');
    }

    _getScore(word) {
        const scoring_constant = 1.95;
        const scoring_power_divisor = 3;

        const exponent = word.length / scoring_power_divisor;
        const score = Math.floor(Math.pow(scoring_constant, exponent));
        return score;
    }

}

module.exports = ['apiService', wordService];