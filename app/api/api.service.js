class apiService {
    constructor(firebaseService, $timeout) {
        this._$timeout = $timeout;
        this._rootReference = firebaseService.database().ref();
        this._database = null;

        // If data is requested before we have it back from the API, 
        // we queue the requests here
        this._queuedActions = [];

        this._rootReference.on('value', (snapshot) => {
            this._database = snapshot.val();
            this._processQueuedActions();
        });
    }

    getWords(callback) {
        if (this._database !== null) {
            const words = Object.keys(this._database.words);
            this._$timeout(() => callback(words));
        }
        else {
            this._queueAction(this.getWords, callback);
        }
    }

    getScores(callback) {
        if (this._database !== null) {
            let scores = [];
            for (let key in this._database.scores) {
                let scoreObj = this._database.scores[key];
                scores.push({
                    id: key,
                    score: scoreObj.score,
                    name: scoreObj.name
                });
            }
            scores = scores.sort((a, b) => {
                return b.score - a.score;
            });
            
            this._$timeout(() => callback(scores));
        }
        else {
            this._queueAction(this.getScores, callback); 
        }
    }

    addScore(name, score) {
        const scoreId = this._rootReference.child('scores').push().key;
        const scoreReference = "/scores/" + scoreId;

        const scoreUpdate = {
            [scoreReference]: {
                name,
                score
            }
        }
        this._rootReference.update(scoreUpdate);
        return scoreId;
    }

    _processQueuedActions() {
        this._queuedActions.forEach((action) => {
            action.apiCall.call(this, action.callback);
        });
        this._queuedActions = [];
    }

    _queueAction(apiCall, callback) {
        this._queuedActions.push({
            apiCall,
            callback
        });
    }
}

module.exports = ['firebaseService', '$timeout', apiService];








