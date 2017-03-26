class wordService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    get(callback) {
        const self = this;
        const words = this.apiService.getWords(function processWordList(words) {
            const random = Math.floor(Math.random() * words.length);
            const word = self._jumble(words[random]);
            callback(word);
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

}

module.exports = ['apiService', wordService];