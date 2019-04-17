const functions = require('firebase-functions');

const admin = require ('firebase-admin');
admin.initializeApp();

exports.checkUser = functions.https.onCall((data, context)=> {
  const uid = '';
  const authUser = await admin.auth().getUser(uid)

  console.log(authUser.email);
  return ref.get().then(doc => {
    return{unique: !doc.exists}
  }).catch(error => {
    throw new functions.https.HttpsError('failed to connect')
  })

});
