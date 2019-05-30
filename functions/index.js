const functions = require('firebase-functions');

const admin = require ('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const createProfile = (userRecord, context) => {
  const {email, displayName, uid } = userRecord;

  return db.collection('users').doc(uid).set({email, displayName}).catch(console.error)
};

/*exports.checkUser = functions.https.onCall((data, context)=> {
 // const uid = '';
 // const authUser = await admin.auth().getUser(uid)
  const ref = admin.firestore().collection('users').doc(data.uid);
  return ref.get().then(doc => {
    return{unique: !doc.exists}
  }).catch(err => {
    throw new functions.https.HttpsError('failed to connect')
  })

});*/

module.exports = {
  authOnCreate: functions.auth.user().onCreate(createProfile)
};