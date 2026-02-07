import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  databaseURL: "https://network-cecda-default-rtdb.firebaseio.com/",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const postsRef = database.ref("posts");

export const getPosts = async () => {
  const snapshot = await postsRef.once("value");
  const data = snapshot.val() || {};
  return Object.values(data).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};

export const getPostById = async (id) => {
  const snapshot = await postsRef.child(id).once("value");
  return snapshot.val();
};

export const getPostBySlug = async (slug) => {
  const snapshot = await postsRef
    .orderByChild("slug")
    .equalTo(slug)
    .once("value");
  const data = snapshot.val();
  if (!data) return null;
  return Object.values(data)[0];
};

export const createPost = async (post) => {
  const ref = postsRef.push();
  await ref.set({ ...post, id: ref.key });
  return { ...post, id: ref.key };
};

export const updatePost = async (id, updatedPost) => {
  await postsRef.child(id).update(updatedPost);
  return updatedPost;
};

export const deletePost = async (id) => {
  await postsRef.child(id).remove();
  return true;
};