const firebase = require('firebase');
const firebaseui = require('firebaseui');
const ui = new firebaseui.auth.AuthUI(firebase.auth());


function login() {
    if(ui.isPendingRedirect()){
        ui.start('#firebaseui-auth-container', {
            signInOptions: [{
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // Required to enable this provider in one-tap sign-up.
                authMethod: 'https://accounts.google.com',
                // Required to enable ID token credentials for this provider.
                // This can be obtained from the Credentials page of the Google APIs
                // console.
                clientId: 'xxxxxxxxxxxxxxxxx.apps.googleusercontent.com'
            },
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
            credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
        });
        ui.disableAutoSignIn();
    }
}