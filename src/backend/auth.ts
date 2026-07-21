import {
  browserLocalPersistence,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
};

export type SavedOperation = {
  id: string;
  treatment: string;
  county: string;
  state: string;
  notes: string;
  createdAt?: unknown;
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

export async function updateAccountProfile(displayName: string) {
  if (!auth.currentUser) {
    throw new Error("You must be signed in to update your account.");
  }

  const normalizedDisplayName = displayName.trim();

  await updateProfile(auth.currentUser, {
    displayName: normalizedDisplayName || null,
  });

  await setDoc(
    doc(db, "userProfiles", auth.currentUser.uid),
    {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: normalizedDisplayName || null,
      updatedAt: serverTimestamp(),
      schemaVersion: 1,
    },
    { merge: true },
  );
}

export function subscribeToSavedOperations(
  userId: string,
  callback: (operations: SavedOperation[]) => void,
) {
  const savedOperationsQuery = query(
    collection(db, "userProfiles", userId, "savedOperations"),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(savedOperationsQuery, (snapshot) => {
    callback(
      snapshot.docs.map((savedOperationDoc) => ({
        id: savedOperationDoc.id,
        ...(savedOperationDoc.data() as Omit<SavedOperation, "id">),
      })),
    );
  });
}

export async function createSavedOperation(
  userId: string,
  input: Pick<SavedOperation, "treatment" | "county" | "state" | "notes">,
) {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    throw new Error("You must be signed in to save an operation.");
  }

  return addDoc(collection(db, "userProfiles", userId, "savedOperations"), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    schemaVersion: 1,
  });
}

export function deleteSavedOperation(userId: string, operationId: string) {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    throw new Error("You must be signed in to remove a saved operation.");
  }

  return deleteDoc(doc(db, "userProfiles", userId, "savedOperations", operationId));
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
