module.exports = ['firebaseLib', 'apiConfig', firebaseService];

 function firebaseService(firebaseLib, apiConfig) {
    firebaseLib.initializeApp(apiConfig);
    
    return firebaseLib;
}