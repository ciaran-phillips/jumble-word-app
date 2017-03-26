class apiService {
    constructor(firebaseService, $timeout) {
        this._$timeout = $timeout;
        this._rootReference = firebaseService.database().ref();
        this._database = null;

        // If data is requested before we have it back from the API, 
        // we queue the requests in this._queuedActions
        //
        // This is a bit different to normal API patterns, in that
        // we're only ever going to be waiting on the backend during
        // initial page load (then we're just relying on the firebase lib
        // to keep things up to date).
        // 
        // It would probably have been cleaner to just allow a delay 
        // at the start to get all the data, and then have only synchronous
        // operations after that
        this._queuedActions = [];

        this._rootReference.on('value', (snapshot) => {
            this._database = snapshot.val();
            this._processQueuedActions();
        });
    }

    /**
     * Get array of words from the API 
     * 
     * @param {function} callback
     *      callback that accepts an array of strings
     *      as the first argument, i.e. callback(string[])
     */
    getWords(callback) {
        if (this._database !== null) {
            const words = Object.keys(this._database.words);
            this._$timeout(() => callback(words));
        }
        else {
            this._queueAction(this.getWords, callback);
        }
    }

    /**
     * Get array of high scores from the API
     * 
     * @param {function} callback
     *      callback accepting an array of
     *      score objects, i.e. callback(score[])
     *      where a score object takes the form:
     *      {id: string, score: number, name: string}
     */
    getScores(callback) {
        if (this._database !== null) {
            let scores = [];
            // I couldn't see a way to store arrays in firebase, so 
            // what we get from the database here is an object that
            // requires a bit of processing
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

    /**
     * Add a score to the database
     * 
     * @param {string} name
     *      User name to be associated with the score
     * @param {number} score
     *      Score that the user achieved
     * 
     * @return {string}
     *      ID given to this score record in the DB
     */
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

    /**
     * Calls any queued API calls, and clears the queue
     */
    _processQueuedActions() {
        this._queuedActions.forEach((action) => {
            action.apiCall.call(this, action.callback);
        });
        this._queuedActions = [];
    }

    /**
     * Queues an API call to be invoked later
     * 
     * @param {function} apiCall
     *      API call to be invoked
     * @param {function} callback
     *      callback to be invoked when the API call is completed
     */
    _queueAction(apiCall, callback) {
        this._queuedActions.push({
            apiCall,
            callback
        });
    }
}

module.exports = ['firebaseService', '$timeout', apiService];








