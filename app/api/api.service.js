module.exports = ['firebaseService', apiService];

function apiService(firebaseService) {
    
        this.rootReference = firebaseService.database().ref();
        this.database = {};
        this.rootReference.on('value', (snapshot) => {
            this.database = snapshot.val();
            console.log(this.database);
        });
}
apiService.prototype.getFullDatabase = function() {
    return this.database;
}
apiService.prototype.getWords = function() {
    return this.database.words;
}
apiService.prototype.getScores = function() {
    return this.database.scores;
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
    return this.rootReference.update(scoreUpdate);
}