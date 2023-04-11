import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useLocation, useParams } from "react-router-dom";
import profile from "../assets/user.png";
import { buyEnergy } from "../utils/firebase";
import NavBar from "./navBar";

const Company = () => {
  const [value, setValue] = useState(0);
  const [add, setAdd] = useState();
  const location = useLocation();
  console.log(location.state, "okay");
  const { id } = useParams();
  console.log(id, "id");
  const tk = window.tronWeb.toDecimal(location.state?.tokenPrice._hex);
  const tokenPrice = window.tronWeb.fromSun(tk);
  const pKWH = window.tronWeb.toDecimal(location.state?.priceKwh._hex);
  // const pricePKwh = window.tronWeb.fromSun(pKWH);
  const rt = window.tronWeb.toDecimal(location.state?.rate._hex);
  const rate = window.tronWeb.fromSun(rt);

  const buyElectricity = async () => {
    const buy = toast.loading("⏳ Buying electricity...");
    const tronWeb = window.tronLink;
    await tronWeb.request({
      method: "tron_requestAccounts",
    });
    const { base58 } = window.tronWeb.defaultAddress;
    const address = window.tronWeb.address.toHex(base58);
    setAdd(address);
    console.log(location.state?.id);
    const contract = await window.tronWeb
      .contract()
      .at("TYuNs7TZEGavhaVwBPfjzDSYC6sGjuXk7Q");

    const amount = await window.tronWeb.toSun(tokenPrice * value);
    toast.loading("✍ Signing transaction...", {
      id: buy,
    });
    const response = await contract.buyElectricity(location.state?.id).send({
      feeLimit: 600000000,
      callValue: amount,
    });

    await buyEnergy(address, amount, value, response, "Bought Electricity")
      .then((res) => {
        toast.success("✅ Done", {
          id: buy,
        });
        console.log("Done");
      })
      .catch((error) => {
        toast.error("❌ Failed", {
          id: buy,
        });
        console.log(error.message);
      });
    console.log(response);
  };

  return (
    <>
      <NavBar addy={add} />
      <div className="md:px-16 py-3 px-4">
        <div className="bg-green-500 px-4 w-fit py-2 rounded-lg">
          <Link to="/marketplace" className="w-fit">
            <ArrowLeftIcon className="w-6 h-6 text-white" />
          </Link>
        </div>
        <div>
          <p className="text-center text-3xl font-Patua">Company details</p>
          <div className="flex items-center py-16 space-x-4 md:flex-row flex-col">
            <div>
              <img
                src={location?.state?.imgUrl || profile}
                alt="profile"
                className="w-[250px]"
              />
            </div>
            <div>
              <div>
                <p className=" font-Patua font-semibold">
                  Company Name:{" "}
                  <span className=" font-medium">{location?.state?.title}</span>
                </p>
                <p className=" font-Patua font-semibold">
                  Company Owner:{" "}
                  <span className="font-medium">
                    {location?.state?.owner}
                  </span>
                </p>
                <p className=" font-Patua font-semibold">
                  Price: <span className=" font-medium">{pKWH} Trx</span>
                </p>
                <p className=" font-Patua font-semibold">
                  Token Price:{" "}
                  <span className=" font-medium">{tokenPrice} Trx</span>
                </p>
                <p className=" font-Patua font-semibold">
                  Rate: <span className=" font-medium">{rate}</span>
                </p>
              </div>
              <div>
                <input
                  type="range"
                  min={10}
                  max={300}
                  value={value}
                  step={1}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full cursor-pointer"
                />
                <input
                  className="py-2 px-4"
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <div>
                  <p className="text-[14px] font-Cinzel font-semibold">
                    Energy:{" "}
                    <span className="text-sm font-Indie">{value} KW/h</span>
                  </p>
                  <p className="text-[14px] font-Cinzel font-semibold">
                    Cost:{" "}
                    <span className="text-sm font-Indie">
                      {tokenPrice * value} TRX
                    </span>
                  </p>
                </div>
              </div>
              <div className="py-3">
                <p
                  className="px-5 bg-green-500 py-2 w-fit rounded-sm text-white font-semibold font-Cinzel cursor-pointer"
                  onClick={buyElectricity}
                >
                  Buy Electricity
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Company;
