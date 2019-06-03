const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const createProfile = (userRecord, context) => {
  const { email, displayName, uid } = userRecord;

  return db
    .collection('users')
    .doc(uid)
    .set({ email, displayName })
    .catch(console.error);
};

module.exports = {
  authOnCreate: functions.auth.user().onCreate(createProfile)
};


exports.addAdminRole =  functions.https.onCall((data, context) => {
  //get user and add custom claim(admin)
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    })

  }).then(() => {
    return {
      message:`Success! ${data.email} has been made an admin`
    }
  }).catch(error => {
    return error
  })

})