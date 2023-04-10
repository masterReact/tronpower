import React, {  useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/LOGO.svg";
import { checkIfUserExist } from "../utils/firebase";

const NavBar = ({ addy }) => {
  //----------States---------------//
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    const tronWeb = window.tronLink;
    await tronWeb.request({
      method: "tron_requestAccounts",
    });
    const {  base58 } = window.tronWeb.defaultAddress;
    const address = window.tronWeb.address.toHex(base58);
    setAddress(base58);

    await checkIfUserExist(address);
  };
  return (
    <div className="grid grid-cols-7 bg-black py-2 px-[2rem] text-white">
      <div className="flex items-center lg:col-span-2 col-span-5">
        <Link to="/">
          <img src={logo} alt="abuadenergy" className="w-[100px]" />
        </Link>
      </div>
      <div className="hidden lg:flex col-span-3 text-[13px] justify-center items-center">
        <ul className="flex space-x-5 justify-center">
          <li>About</li>
          <li>Support</li>
          <li>Plans</li>
          <Link to="/marketplace">
            <li>Marketplace</li>
          </Link>
        </ul>
      </div>
      <div className="col-span-2 flex items-center justify-end">
        {addy ? (
          <>
            <p
              className="mr-[2rem] bg-[#447113] cursor-pointer transition-all hover:px-[1.1rem] hover:py-[0.6rem] px-4 rounded py-2 text-[13px]"
              // onClick={connectwallet}
            >
              <span className="mx-1">User:</span>
              {addy?.substring(0, 5)}...
              {addy?.substring(addy.length, addy.length - 5)}
            </p>
          </>
        ) : (
          <>
            {address ? (
              <p
                className="mr-[2rem] bg-[#447113] cursor-pointer transition-all hover:px-[1.1rem] hover:py-[0.6rem] px-4 rounded py-2 text-[13px]"
                // onClick={connectwallet}
              >
                <span className="mx-1">User:</span>
                {address?.substring(0, 5)}...
                {address?.substring(address.length, address.length - 5)}
              </p>
            ) : (
              <p
                className="mr-[2rem] bg-[#447113] cursor-pointer transition-all hover:px-[1.1rem] hover:py-[0.6rem] px-4 rounded py-2 text-[13px]"
                onClick={connectWallet}
              >
                Connect Wallet
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
