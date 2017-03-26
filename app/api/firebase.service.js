class firebaseService {
     constructor(firebaseLib, apiConfig) {
        firebaseLib.initializeApp(apiConfig);
        
        return firebaseLib;
     }
}

module.exports = ['firebaseLib', 'apiConfig', firebaseService];