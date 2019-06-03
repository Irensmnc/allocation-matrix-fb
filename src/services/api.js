import store from "@/store";
import { db } from '@/fb';

export function registerProjectsObserver() {
  let ref = db.collection('users_projects').where('userId', '=', store.getters.users.user);

  ref.onSnapshot(snapshot => store.dispatch('users/processProjects', snapshot.docs));
}