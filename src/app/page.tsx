"use client";
import React from "react";
import { auth } from "../app/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { TaskList } from "./task-page";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
export default function Login() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);
  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      setErrorMessage("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage("Please type in your email/password");
        return error.message;
      }
    }
  };
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      setErrorMessage("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage("Please type in your email/password");
        return error.message;
      }
    }
  };
  const handleLogout = async () => {
    await signOut(auth);
  };
  return (
    <div className="flex flex-col gap-4 items-center">
      {user ? (
        <div className="w-full">
          <div className="flex justify-between pr-[20px] pt-[12px]">
            <div className="flex gap-[10px]">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Make sure you added the task in order to insure it is
                      saved in our cloud servers
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>Status</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>Online</MenubarItem>
                    <MenubarItem>Offline</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Busy</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>
          <SidebarProvider className="justify-center">
            <div className="flex">
              <AppSidebar />
              <TaskList />
            </div>
          </SidebarProvider>
        </div>
      ) : (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-64"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-64"
          />
          <div className="flex gap-2">
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Signup
            </button>
          </div>
        </>
      )}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
