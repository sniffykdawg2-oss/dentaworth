import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
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
import { auth, db, requireFirebaseService } from "../firebase";

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
  if (!auth) {
    callback(null);
    return () => {};
  }

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
  const configuredAuth = requireFirebaseService(auth, "Firebase Auth");

  await setPersistence(configuredAuth, browserLocalPersistence);
  const credential = await signInWithEmailAndPassword(configuredAuth, email, password);
  const token = await credential.user.getIdTokenResult();

  await upsertUserProfile(credential.user, Boolean(token.claims.admin));

  return credential.user;
}

export async function createAccountWithEmail(email: string, password: string) {
  const configuredAuth = requireFirebaseService(auth, "Firebase Auth");

  await setPersistence(configuredAuth, browserLocalPersistence);
  const credential = await createUserWithEmailAndPassword(configuredAuth, email, password);
  await upsertUserProfile(credential.user, false);

  return credential.user;
}

export function sendSignInReset(email: string) {
  return sendPasswordResetEmail(requireFirebaseService(auth, "Firebase Auth"), email);
}

export function signOutCurrentUser() {
  return signOut(requireFirebaseService(auth, "Firebase Auth"));
}

export async function updateAccountProfile(displayName: string) {
  const configuredAuth = requireFirebaseService(auth, "Firebase Auth");
  const configuredDb = requireFirebaseService(db, "Firestore");

  if (!configuredAuth.currentUser) {
    throw new Error("You must be signed in to update your account.");
  }

  const normalizedDisplayName = displayName.trim();

  await updateProfile(configuredAuth.currentUser, {
    displayName: normalizedDisplayName || null,
  });

  await setDoc(
    doc(configuredDb, "userProfiles", configuredAuth.currentUser.uid),
    {
      uid: configuredAuth.currentUser.uid,
      email: configuredAuth.currentUser.email,
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
  if (!db) {
    callback([]);
    return () => {};
  }

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
  const configuredAuth = requireFirebaseService(auth, "Firebase Auth");
  const configuredDb = requireFirebaseService(db, "Firestore");

  if (!configuredAuth.currentUser || configuredAuth.currentUser.uid !== userId) {
    throw new Error("You must be signed in to save an operation.");
  }

  return addDoc(collection(configuredDb, "userProfiles", userId, "savedOperations"), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    schemaVersion: 1,
  });
}

export function deleteSavedOperation(userId: string, operationId: string) {
  const configuredAuth = requireFirebaseService(auth, "Firebase Auth");
  const configuredDb = requireFirebaseService(db, "Firestore");

  if (!configuredAuth.currentUser || configuredAuth.currentUser.uid !== userId) {
    throw new Error("You must be signed in to remove a saved operation.");
  }

  return deleteDoc(doc(configuredDb, "userProfiles", userId, "savedOperations", operationId));
}

async function upsertUserProfile(user: User, isAdmin: boolean) {
  const configuredDb = requireFirebaseService(db, "Firestore");

  await setDoc(
    doc(configuredDb, "userProfiles", user.uid),
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
