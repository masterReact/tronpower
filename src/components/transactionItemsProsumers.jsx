import React from 'react'

const transactionItemsProsumers = ({ transaction }) => {
  const ne = new Date(transaction?.date);
  let dateStr =
    ne.getDate() + "/" + (ne.getMonth() + 1) + "/" + ne.getFullYear();

  let amt = window.tronWeb.fromSun(transaction?.sold);

  console.log(dateStr);
  return (
    <div className="grid grid-cols-5 my-2 space-x-2 text-sm bg-gray-950 text-white py-2 px-2 font-Cinzel hover:bg-gray-950/60 transition-all duration-500 cursor-pointer">
      <div className="col-span-2 truncate px-2">{transaction?.hash}</div>
      <div className="col-span-1 hidden md:flex">{transaction?.des}</div>
      <div className="col-span-1">{amt}trx</div>
      <div className="col-span-1 hidden md:flex">{dateStr}</div>
    </div>
  );
};

export default transactionItemsProsumers