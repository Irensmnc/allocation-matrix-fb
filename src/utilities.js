export const collectIdsAndDocs = doc => {
  return { id: doc.id, ...doc.data() };
};

/*  let createProfile = firebase.functions().httppsCallable('createProfile')
  createProfile({userRecord: this.userRecord}).then(result => {
    console.log(result)
  })

  const createUserProfileDocument = async (userRecord, additionalData) => {
    const { email, displayName, uid } = userRecord;

    return db.collection('users').doc(uid).set({ email, displayName }).catch(console.error);

    /* if (!user) return;

    //Get a reference to the place in the database where a userID is located.
    const userRef = db.doc(`users/${ user.uid }`);

    //Go and fetch the document from that location
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      const { displayName, email } = user;
      const createdAt = new Date();
      try {
        await userRef.set({
          displayName,
          email,
          createdAt,
          ...additionalData
        })
      } catch (error) {
        console.error('Error creating user', error);
      }
    };
    const getUserDocument = async (uid) => {
      if (!uid) return null;
      try {
        const userDocument = await firestore.collection('users').doc(uid).get();

        return { uid, ...userDocument.data() };
      } catch (error) {
        console.error('Error fetching user', error.message);
      }
      return getUserDocument(user.uid);
    };
  } */

//let user = firebase.user.uid;
/*   db.collection("projects")/*.where(`owners.${user.uid}`, '==', true).get().then(snapshot => snapshot.forEach(doc => {
const project = snapshot.docs.map(collectIdsAndDocs);
let user = firebase.auth().currentUser;
console.log(user)
const assignedUserProject = db.doc(`assignedUsers/${user.uid}`);

}))
},*/