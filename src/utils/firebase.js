import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
  increment,
} from "firebase/firestore";

//storage ref
import { getStorage } from "firebase/storage";

//Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDpEhZLAJgudBXNheMhaAw47VAwVpz_uws",
  authDomain: "tronpower-897f4.firebaseapp.com",
  projectId: "tronpower-897f4",
  storageBucket: "tronpower-897f4.appspot.com",
  messagingSenderId: "56877840614",
  appId: "1:56877840614:web:36edeb9e27acd7119da327",
  measurementId: "G-73NV7NDX5Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// firestore
export const db = getFirestore();

//Firebase AUTH
export const auth = getAuth();

// Firebase storage
export const storage = getStorage(app);

// create user
export const createUser = async (userWallet, userName, type, id, userImage) => {
  const userDocRef = doc(db, "users", userWallet);
  console.log(userDocRef, "doc");
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    try {
      await setDoc(userDocRef, {
        userWallet,
        userName,
        type,
        id,
        userImage,
        order: [
          {
            transactionHash: "New User Reward",
            energy: "100 USDT",
            amount: "",
          },
        ],
      });
      return (window.location.pathname = "/dashboard");
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }
  return userDocRef;
};

// check if userexist
export const checkIfUserExist = async (userWallet) => {
  const querySnapShot = await getDocs(collection(db, "users"));
  let num = null;
  console.log(userWallet);
  querySnapShot.forEach(async (user) => {
    let userId = await user.get("userWallet");
    console.log(userId);
    if (num == null) {
      if (userId === userWallet) {
        num = "exist";
        console.log(num);
        return (window.location.pathname = "/dashboard");
      } else {
        console.log(num);
        return (window.location.pathname = "/onboarding");
      }
    } else if (num === "exist") {
      return (window.location.pathname = "/dashboard");
    }
  });
};

// check if userexist
export const checkUser = async (userWallet) => {
  const querySnapShot = await getDocs(collection(db, "users"));
  let answer;
  querySnapShot.forEach((user) => {
    let userId = user.get("userWallet");
    if (userId === userWallet) {
      answer = true;
    } else {
      answer = false;
    }
  });
  console.log(answer);
};

// get a particular user details
export const getUserDetailsByWallet = async (userWallet) => {
  const docRef = doc(db, "users", userWallet);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let userData = docSnap.data();
    return { userData };
  } else {
    let userData = "login again";
    return { userData };
  }
};

// Buy energy in the buy page
export const buyEnergy = async (userWallet, amount, energyInKw, hash, pin) => {
  const docRef = doc(db, "users", userWallet);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, {
      totalEnergy: increment(energyInKw),
    })
      .then(async () => {
        const array = docSnap.data().order;
        array.push({
          energyBought: energyInKw,
          transactionAmount: amount,
          transactionHash: hash,
          transactionDate: new Date(),
          energyPin: pin,
        });
        await updateDoc(docRef, {
          order: array,
        })
          .then(() => {
            console.log("transaction completed successfully");
          })
          .catch((e) => {
            console.log(e.me, "Error from appending array");
          });
      })
      .catch((e) => {
        console.log(
          e.messsage,
          "error from creating the transaction row in firebase"
        );
      });
  }
};
