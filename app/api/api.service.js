class apiService {
    constructor(firebaseService, $timeout) {
        this.$timeout = $timeout;
        this.rootReference = firebaseService.database().ref();
        this.database = null;

        // If data is requested before we have it back from the API, 
        // we queue the requests here
        this.queuedActions = [];

        this.rootReference.on('value', (snapshot) => {
            this.database = snapshot.val();
            this.processQueuedActions();
        });
    }

    getFullDatabase() {
        return this.database;
    }

    getWords(callback) {
        if (this.database !== null) {
            const words = Object.keys(this.database.words);
            this.$timeout(() => callback(words));
        }
        else {
            this.queueAction(this.getWords, callback);
        }
    }

    getScores(callback) {
        if (this.database !== null) {
            let scores = [];
            for (let key in this.database.scores) {
                let scoreObj = this.database.scores[key];
                scores.push({
                    id: key,
                    score: scoreObj.score,
                    name: scoreObj.name
                });
            }
            scores = scores.sort((a, b) => {
                return b.score - a.score;
            });
            
            this.$timeout(() => callback(scores));
        }
        else {
            this.queueAction(this.getScores, callback); 
        }
    }

    addScore(name, score) {
        const scoreId = this.rootReference.child('scores').push().key;
        const scoreReference = "/scores/" + scoreId;

        const scoreUpdate = {
            [scoreReference]: {
                name,
                score
            }
        }
        this.rootReference.update(scoreUpdate);
        return scoreId;
    }

    processQueuedActions() {
        this.queuedActions.forEach((action) => {
            action.apiCall.call(this, action.callback);
        });
        this.queuedActions = [];
    }

    queueAction(apiCall, callback) {
        this.queuedActions.push({
            apiCall,
            callback
        });
    }
}

module.exports = ['firebaseService', '$timeout', apiService];








