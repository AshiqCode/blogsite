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

const toArrayWithIds = (val) => {
  const obj = val || {};
  return Object.entries(obj).map(([id, post]) => ({
    ...(post || {}),
    id,
  }));
};

export const getPosts = async () => {
  const snapshot = await postsRef.once("value");
  const list = toArrayWithIds(snapshot.val());

  return list.sort((a, b) => {
    const ta = new Date(a.createdAt || 0).getTime();
    const tb = new Date(b.createdAt || 0).getTime();
    return tb - ta;
  });
};

export const getPostById = async (id) => {
  const snapshot = await postsRef.child(id).once("value");
  const post = snapshot.val();
  return post ? { ...post, id } : null;
};

export const getPostBySlug = async (slug) => {
  const snapshot = await postsRef
    .orderByChild("slug")
    .equalTo(slug)
    .once("value");

  const obj = snapshot.val();
  if (!obj) return null;

  const [id, post] = Object.entries(obj)[0];
  return { ...(post || {}), id };
};

export const createPost = async (post) => {
  const ref = postsRef.push();
  const payload = { ...post, id: ref.key };
  await ref.set(payload);
  return payload;
};

export const updatePost = async (id, updatedPost) => {
  await postsRef.child(id).update(updatedPost);
  return updatedPost;
};

export const deletePost = async (id) => {
  await postsRef.child(id).remove();
  return true;
};
