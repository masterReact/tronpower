import React from "react";
import image from "../assets/user.png";

const Companies = ({ data }) => {
  const tk = window.tronWeb?.toDecimal(data?.tokenPrice);
  const tokenPrice = window.tronWeb?.fromSun(tk);
  const pKWH = window.tronWeb?.toDecimal(data?.priceKwh);
  const pricePKwh = window.tronWeb?.fromSun(pKWH);
  return (
    <div className="col-span-1 h-[30vh] bg-[#447113] hover:bg-[#447113]/80 transition-all duration-500 text-white flex flex-col py-3 px-3 rounded-sm mx-2 my-2">
      <div className="flex items-center justify-center flex-1">
        <img src={data?.imgUrl || image} alt="" className="h-[15vh]" />
      </div>
      <div className="">
        <div className="col-span-1">
          <p className="text-sm font-Indie truncate">
            Name: <span>{data?.title}</span>{" "}
          </p>
          <p className="text-sm font-Indie truncate">
            Address: <span>{data?.owner}</span>
          </p>
        </div>
        <div className="col-span-1">
          <p className="text-sm font-Indie">
            TokenPrice: <span className=" space-x-1">{tokenPrice}TRX</span>
          </p>
          <p className="text-sm font-Indie">
            PricePerKwh: <span className=" space-x-1">{pricePKwh}TRX</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Companies;
