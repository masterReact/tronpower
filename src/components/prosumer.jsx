import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../assets/user.png";
import LineChart from "./lineGraph";
import TransactionItems from "./transactionItems";

const Prosumer = ({ userData }) => {
  const [xaxis, setXaxis] = useState();
  const [yaxis, setYaxis] = useState();
  const navigate = useNavigate();
  const [totalSales, setTotalSales] = useState();
  const [totalEnergy, setTotalEnergy] = useState();
  const [totalEnergyBal, setTotalEnergyBal] = useState();
  const [totalBal, setTotalBal] = useState();

  const getGraph = () => {
    console.log(userData);
    try {
      const dataX = [];
      const dataY = [];
      const dataE = [];
      //eslint-disable-next-line
      userData?.order.map((item) => {
        const ne = new Date(item?.date);
        let dateStr =
          ne.getDate() + "/" + (ne.getMonth() + 1) + "/" + ne.getFullYear();
        let d1 = window.tronWeb.fromSun(item?.sold);
        dataX.push(dateStr);
        dataE.push(item?.kwh);
        dataY.push(d1);
      });
      const tot = dataY
        .map(function (elt) {
          // assure the value can be converted into an integer
          return /^\d+$/.test(elt) ? parseInt(elt) : 0;
        })
        .reduce(function (a, b) {
          // sum all resulting numbers
          return a + b;
        });
      const eEnergy = dataE
        .map(function (elt) {
          // assure the value can be converted into an integer
          return /^\d+$/.test(elt) ? parseInt(elt) : 0;
        })
        .reduce(function (a, b) {
          // sum all resulting numbers
          return a + b;
        });
      setTotalEnergy(eEnergy);
      setTotalSales(tot);
      setXaxis(dataX);
      setYaxis(dataY);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getBal = async () => {
    const tronWeb = window.tronLink;
    await tronWeb.request({
      method: "tron_requestAccounts",
    });
    const { base58 } = window.tronWeb.defaultAddress;
    const address = window.tronWeb.address.toHex(base58);
    const bal = window.tronWeb.fromSun(
      await window.tronWeb.trx.getBalance(base58)
    );
    setTotalBal(bal);
    const contract = await window.tronWeb
      .contract()
      .at("TYuNs7TZEGavhaVwBPfjzDSYC6sGjuXk7Q");
    const eBal = window.tronWeb.toDecimal(
      await contract.balances(address).call()
    );
    setTotalEnergyBal(eBal);
  };

  const handleClicked = () => {
    navigate("/dashboard/settings", {
      state: {
        img: userData?.userImage,
        id: userData?.id,
        name: userData?.userName,
      },
    });
  };

  useEffect(() => {
    getGraph();
    getBal();
    //eslint-disable-next-line
  }, [userData]);

  return (
    <div className="pt-14">
      <div>
        <div className="px-16 flex items-center justify-end">
          <img
            src={userData?.userImage || profile}
            alt="profile"
            className="w-12 h-12 rounded-lg cursor-pointer"
            onClick={handleClicked}
          />
        </div>
      </div>
      <div className="md:grid grid-cols-4 md:space-x-4 space-y-2 md:space-y-0 py-3 px-16">
        <div className="col-span-1 px-2 flex flex-col justify-center md:h-[20vh] py-3 md:py-0 bg-green-200">
          <p className="text-2xl font-Cinzel font-semibold">
            Total Energy Sold
          </p>
          <p className="text-xl font-Patua">{totalEnergy || 0} KWh</p>
        </div>
        <div className="col-span-1 px-2 flex flex-col justify-center md:h-[20vh] py-3 md:py-0 bg-green-200">
          <p className="text-2xl font-Cinzel font-semibold">Total Sales</p>
          <p className="text-xl font-Patua">{totalSales || 0}TRX</p>
        </div>
        <div className="col-span-1 px-2 flex flex-col justify-center md:h-[20vh] py-3 md:py-0 bg-green-200">
          <p className="text-2xl font-Cinzel font-semibold">Tron Balance</p>
          <p className="text-xl font-Patua">{totalBal || 0} TRX</p>
        </div>
        <div className="col-span-1 px-2 flex flex-col justify-center md:h-[20vh] py-3 md:py-0 bg-green-200">
          <p className="text-2xl font-Cinzel font-semibold">Energy balance</p>
          <p className="text-xl font-Patua">{totalEnergyBal || 0} kwh</p>
        </div>
      </div>
      <div className="md:grid grid-cols-5 md:space-x-8 px-16 space-y-2">
        <div className="col-span-3 bg-green-100 h-[50vh]">
          <div className="grid grid-cols-5 space-x-2 text-sm py-3 font-semibold">
            <div className="col-span-2 text-center">Transaction Hash</div>
            <div className="col-span-1 hidden md:flex">Description</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-1 hidden md:flex">Date</div>
          </div>
          <div className="h-[40vh] overflow-y-scroll">
            {userData?.order.map((item, i) => (
              <TransactionItems key={i} transaction={item} />
            ))}
          </div>
        </div>
        <div className="col-span-2 bg-green-100 h-[50vh]">
          {xaxis && yaxis && <LineChart labels={xaxis} data={yaxis} />}
        </div>
      </div>
    </div>
  );
};

export default Prosumer;
