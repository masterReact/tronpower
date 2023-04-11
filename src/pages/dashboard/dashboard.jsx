import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import NavBar from "../../components/navBar";
import Producer from "../../components/producer";
import Prosumer from "../../components/prosumer";
import UserDashboard from "../../components/userDashboard";
import { getUserDetailsByWallet } from "../../utils/firebase";

const Dashboard = () => {
  const [add, setAdd] = useState();
  const [userDetails, setUserDetails] = useState();
  const db = getFirestore();
  const getAddy = async () => {
    const not = toast.loading("⏳ Loading userdetails...");
    const tronWeb = window.tronLink;
    await tronWeb?.request({
      method: "tron_requestAccounts",
    });
    const { base58 } = await window.tronWeb?.defaultAddress;
    const address = await window.tronWeb?.address.toHex(base58);
    console.log(address);
    setAdd(address);
    const { userData } = await getUserDetailsByWallet(address);
    console.log(userData, "okay");
    setUserDetails(userData);
    toast.success("✅Done", {
      id: not,
    });
  };

  const getD = () => {
    const tronweb = window.tronWeb;
    if (!tronweb) return;
    const { base58 } = tronweb.defaultAddress;
    const address = tronweb.address.toHex(base58);
    if (!address) return;
    const myCollection = doc(db, "users", address);

    const unsubscribe = onSnapshot(myCollection, (querySnapshot) => {
      const newData = querySnapshot.data();
      console.log("changes made");
      setUserDetails(newData); // Update the state with the retrieved data
    });
    return () => unsubscribe();
  };

  useEffect(
    () => {
      getAddy();
      getD();
    },
    // eslint-disable-next-line
    []
  );
  return (
    <>
      {userDetails ? (
        <>
          <NavBar addy={add} />
          {userDetails?.type === "prosumer" ? (
            <Prosumer userData={userDetails} />
          ) : userDetails?.type === "consumer" ? (
            <UserDashboard />
          ) : (
            <Producer />
          )}
        </>
      ) : (
        <>Loading....</>
      )}
    </>
  );
};

export default Dashboard;
