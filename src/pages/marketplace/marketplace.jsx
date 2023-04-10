import React, { useEffect, useState } from "react";
import NavBar from "../../components/navBar";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Companies from "../../components/companies";
import { generatePath, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Marketplace = () => {
  //----------------------------------------- STATE VARIABLES -----------------------------------------------------//
  const [companies, setCompanies] = useState();

  // Navigate for routing and passing state
  const navigate = useNavigate();

  // get all the prosumers and producers on tron power
  const getCompanies = async () => {
    try {
      const notification = toast.loading("⏳ Loading companies..."); // start notification

      const tronweb = await window.tronWeb; // initialize tronweb object with extenstion
      const contract = await tronweb
        ?.contract()
        .at("TEiVdSGEt3cyCyZqREwTCDQoGRqAKpRqGF"); // get the smart contract object
      // old TG5h3ZKFk3QpBTrdvmjqfPpMvyFejuDzvD

      const data = await contract?.numberOfProsumer().call(); // get total number of prosumer created so far
      // convert hex to decimal
      const decimalValue = tronweb?.toDecimal(data); //convert from bigNumber

      let prosumers = [];

      // loop through using the number of prosumers to get all prosumers and producers
      for (let index = 0; index < decimalValue; index++) {
        const item = await contract.prosumers(index).call();
        item["id"] = index;
        prosumers.push(item);
      }
      // end notification when done
      toast.success("✅ Done", {
        id: notification,
      });
      setCompanies(prosumers); // set companies state to the total prosumers
    } catch (error) {
      toast.error(`❌ ${error.message}`); // incase of error set notification to error
    }
  };

  // handle proceed to slected company
  const handleProceed = (id, item) => {
    console.log(id);
    id &&
      navigate(generatePath("/marketPlace/company/:id", { id }), {
        state: {
          owner: item?.owner,
          title: item?.title,
          imgUrl: item?.imgUrl,
          rate: item?.rate,
          priceKwh: item?.priceKwh,
          tokenPrice: item?.tokenPrice,
          lastUpdate: item?.lastUpdate,
          id: item?.id,
        },
      });
  };

  // useeffect
  useEffect(() => {
    getCompanies();
  }, []);

  return (
    <>
      <NavBar />
      <div className="px-14 pt-14">
        <p className="font-semibold font-Pacifico text-2xl text-center py-1">
          TRON POWER MARKETPLACE
        </p>
        <p className="text-center font-semibold font-Indie py-1 pb-3">
          Energy companies ({companies?.length})
        </p>
        <div className="bg-black h-[70vh]">
          <div className="flex space-x-2 border border-green-500 py-1 w-fit items-center px-6 text-white rounded">
            <input
              type="text"
              placeholder="search for companies "
              className="px-6 py-1 text-sm bg-transparent text-white"
            />
            <MagnifyingGlassIcon className="w-5 h-5" />
          </div>
          <div className="lg:grid grid-cols-6 px-2 py-2">
            {companies?.map((item, i) => (
              <div
                key={i}
                onClick={() => handleProceed(item?.title, item)}
                className=" cursor-pointer"
              >
                <Companies data={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Marketplace;

// Old contract TEiVdSGEt3cyCyZqREwTCDQoGRqAKpRqGF
