import React, { useEffect, useState } from "react";
import Header from "../../components/navBar";
import mobile from "../../assets/mobile.svg";
import ele from "../../assets/ele.png";
import { Typewriter } from "react-simple-typewriter";

const HomePage = () => {
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    try {
      const tronWeb = window.tronLink;
      await tronWeb?.request({
        method: "tron_requestAccounts",
      });
      const { base58 } = window.tronWeb?.defaultAddress;
      //  const address = window.tronWeb.address.toHex(base58);
      setAddress(base58);
    } catch (error) {}
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="h-screen">
      <Header addy={address} />
      <img
        src={ele}
        alt="ele"
        className="absolute z-[-1] opacity-25 h-screen"
      />
      <div className="grid grid-cols-2 z-100">
        <div className="col-span-2 md:col-span-1 px-6 flex items-center justify-center flex-col space-y-3 py-7 md:py-2">
          <h1 className="text-[#447113] text-3xl md:text-5xl font-semibold font-Cinzel">
            TRON POWER
          </h1>
          <p className="text-xl">All in one solution to manage your</p>
          <div className="text-2xl text-[#447113] font-semibold">
            <Typewriter
              words={[
                "Estate",
                "Neighbourhood",
                "Apartment",
                "Office",
                "Company",
              ]}
              loop={20}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </div>
          <div className="py-5 mx-[20%] text-center text-sm">
            <p>
              <span className="text-[#447113] font-semibold">TRON POWER</span>{" "}
              is an all-in-one community management solution for multi-unit
              residential and commercial communities. We provide best-in-class
              software for property managers, owners, and tenants in all types
              of communities.
            </p>
          </div>
          <div className="space-x-3 text-white">
            <button className="px-3 py-2 rounded-sm text-sm bg-[#447113]">
              Get started
            </button>
            <button className="px-3 py-2 rounded-sm text-sm bg-black">
              Marketplace
            </button>
          </div>
          <div></div>
        </div>
        <div className="col-span-1 md:flex items-center justify-center hidden">
          <img src={mobile} alt="" className="h-2/3" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
