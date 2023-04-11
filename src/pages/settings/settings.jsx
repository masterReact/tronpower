import React, { useEffect, useState } from "react";
import NavBar from "../../components/navBar";
import profile from "../../assets/user.png";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";

const Settings = () => {
  //------------------------------------STATE-----------------------------------------------------------------//
  const [newTKKWH, setNewTKKWH] = useState();
  const [newRate, setNewRate] = useState();
  const [add, setAdd] = useState();
  const location = useLocation();
  const naviagte = useNavigate();
  const updateRate = async () => {
    try {
      const tronweb = window.tronWeb;
      const contract = await tronweb
        .contract()
        .at("TYuNs7TZEGavhaVwBPfjzDSYC6sGjuXk7Q");
      const response = await contract
        .updateRate(newRate, location.state?.id)
        .send({
          feeLimit: 60000000,
          callValue: 0,
        });
      console.log(response);
    } catch (error) {}
  };

  const updateTokensPKWh = async () => {
    try {
      const tronweb = window.tronWeb;
      const contract = await tronweb
        .contract()
        .at("TYuNs7TZEGavhaVwBPfjzDSYC6sGjuXk7Q");

      const response = await contract
        .updateTokensPerKWH(newTKKWH, location.state?.id)
        .send({
          feeLimit: 60000000,
          callValue: 0,
        });
      console.log(response);
    } catch (error) {}
  };

  const connectWallet = async () => {
    const tronWeb = window.tronLink;
    await tronWeb.request({
      method: "tron_requestAccounts",
    });
    const { base58 } = window.tronWeb.defaultAddress;
    const address = window.tronWeb.address.toHex(base58);
    setAdd(address);
  };

  const handleNavigate = () => {
    naviagte("/dashboard");
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <>
      <NavBar addy={add} />
      <div>
        <div className="space-x-3 flex items-center px-16 py-10">
          <div>
            <img
              src={location.state?.img || profile}
              alt="profile"
              className="w-16 h-16"
            />
          </div>
          <div>
            <p className="font-semibold">
              Company Name: <span>{location.state?.name}</span>
            </p>
            <p className="text-sm font-Pacifico">Tron Power</p>
          </div>
        </div>
        <div className="flex justify-center h-28 items-center space-x-4 py-[7rem]">
          <div className="bg-slate-100 w-[30%] flex flex-col px-4 py-4 space-y-4 shadow-2xl border-green-500 border rounded-sm">
            <p className="text-center font-Pacifico font-medium">
              Update Tokens per KWH
            </p>
            <input
              type="number"
              placeholder="Enter tokensPerKWH"
              className="bg-transparent text-sm text-center py-3"
              onClick={(e) => setNewTKKWH(e.target.value)}
            />
            <button
              className="text-sm bg-green-500 py-2 rounded-sm text-white"
              onClick={updateTokensPKWh}
            >
              Update
            </button>
          </div>
          <div className="bg-slate-100 w-[30%] flex flex-col px-4 py-4 space-y-4 shadow-2xl border-green-500 border rounded-sm">
            <p className="text-center font-Pacifico font-medium">Update Rate</p>
            <input
              type="number"
              placeholder="Enter rate"
              onChange={(e) => setNewRate(e.target.value)}
              className="bg-transparent text-sm text-center py-3"
            />
            <button
              className="text-sm bg-green-500 py-2 rounded-sm text-white"
              onClick={updateRate}
            >
              Update
            </button>
          </div>
        </div>
        <div className="px-16">
          <div
            className="px-4 py-2 bg-green-500 w-fit rounded cursor-pointer"
            onClick={handleNavigate}
          >
            <ArrowLeftIcon className="w-5 h-5 font-semibold text-white" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
