import {
  browserLocalPersistence,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
};

export function subscribeToAuth(callback: (user: AuthUser | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    const token = await firebaseUser.getIdTokenResult();
    await upsertUserProfile(firebaseUser, Boolean(token.claims.admin));

    callback({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      isAdmin: Boolean(token.claims.admin),
    });
  });
}

export async function signInWithEmail(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const token = await credential.user.getIdTokenResult();

  await upsertUserProfile(credential.user, Boolean(token.claims.admin));

  return credential.user;
}

export function sendSignInReset(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export function signOutCurrentUser() {
  return signOut(auth);
}

async function upsertUserProfile(user: User, isAdmin: boolean) {
  await setDoc(
    doc(db, "userProfiles", user.uid),
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      isAdmin,
      lastSignedInAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      schemaVersion: 1,
    },
    { merge: true },
  );
}
