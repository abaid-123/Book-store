import React, { createContext, useState, useEffect } from "react";
import app from "../firebase/firebase.config"; // Ensure the correct path
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Create an AuthContext for providing the authentication state
export const AuthContext = createContext();
const auth = getAuth(app);
const googleprovider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initially set to true while checking auth state

  // Create user function with Firebase
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user); // Set the current user
        return userCredential.user; // Return user data
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        throw error; // Re-throw error to handle in the component
      })
      .finally(() => {
        setLoading(false); // Stop loading in both success and error cases
      });
  };

  const loginwithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleprovider);
  };

  const login=(email,password)=>{
    setLoading(true)
    return signInWithEmailAndPassword(auth,email,password)
  }

  // Log out function to sign out the user
  const logOut = () => {
    setLoading(true);
    return signOut(auth)
      .then(() => {
        setUser(null); // Clear user state on sign out
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      })
      .finally(() => {
        setLoading(false); // Stop loading after logout
      });
  };

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the authenticated user (or null if logged out)
      setLoading(false); // Stop loading once we have the auth state
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  // Context value object to provide to components
  const authInfo = {
    createUser,
    user,
    loginwithGoogle,
    logOut,
    loading,
    login
  };

  // Display a loading screen while the auth state is being verified
  if (loading) {
    return <div>Loading...</div>; // Replace with a better loading indicator if needed
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
