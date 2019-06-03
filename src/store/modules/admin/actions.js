import * as firebase from 'firebase';
import router from '@/router';
import { find } from 'lodash';
import { Firestore as db } from 'firebase';


export async function addProjectAsAdmin ({commit}){
  if (!this.$refs.form.validate()) {
    return;
  }
  commit('SET_LOADING', true);

  await db.collection('projects').add(this.editedItem);

  this.alert = true;

  commit('SET_LOADING', true);

  this.close();
}


export async function deleteProjectAsAdmin({commit}){
  if (!confirm('Are you sure you want to delete this item?')) {
    return;
  }

  await db
    .collection('projects')
    .doc(item.id)
    .delete();
}

export async function assignProjectsAsAdmin({commit}){
  commit('SET_LOADING', true);

  await db.collection('projects')
    .doc(this.$route.params.id)
    .update({
      people: firebase.firestore.FieldValue.arrayUnion({
        userAssigned: this.userAssigned,
        daysAssigned: this.daysAssigned,
        displayName: this.displayName
      })
    });
  commit('SET_LOADING', false);
}

export async function saveEdittedProjects({commit}) {
  if (!this.$refs.form.validate()) {
    return;
  }
  commit('SET_LOADING', true);
  await db
    .collection('projects')
    .doc(this.editedItem.id)
    .set(this.editedItem);

  this.close();
}