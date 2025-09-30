"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../app/firebase";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../app/lib/auth-context";

export default function AuthListener({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const safeUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        dispatch(setUser(safeUser));
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsub();
  }, [dispatch]);

  return <>{children}</>;
}
