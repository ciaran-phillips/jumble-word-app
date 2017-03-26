module.exports = ['firebaseService', '$timeout', apiService];

function apiService(firebaseService, $timeout) {
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

apiService.prototype.getFullDatabase = function() {
    return this.database;
}

apiService.prototype.getWords = function(callback) {
    if (this.database !== null) {
        const words = Object.keys(this.database.words);
        this.$timeout(() => callback(words));
    }
    else {
        this.queueAction(this.getWords, callback);
    }
}

apiService.prototype.getScores = function(callback) {
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

apiService.prototype.addScore = function(name, score) {
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

apiService.prototype.processQueuedActions = function() {
    this.queuedActions.forEach((action) => {
        action.apiCall.call(this, action.callback);
    });
    this.queuedActions = [];
}

apiService.prototype.queueAction = function(apiCall, callback) {
    this.queuedActions.push({
        apiCall,
        callback
    });
}