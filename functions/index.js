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
