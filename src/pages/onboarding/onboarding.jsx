import React, { useEffect, useRef, useState } from "react";
import demoImage from "../../assets/user.png";
import logo from "../../assets/LOGO.svg";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { createUser, storage } from "../../utils/firebase";

const Onboarding = () => {
  const [imagelogo, setImagelogo] = useState();
  const [imageDownload, setImageDownload] = useState();
  const [userData, setUserData] = useState({
    priceInKwh: 0,
    title: "",
    rate: "",
    tokenPrice: 0,
  });
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  // image input ref
  const imagePicker = useRef(null);

  // upload image
  const uploadImage = async () => {
    try {
      const file = imagePicker.current.files[0];
      //   if (!file) return;
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setImageDownload(downloadURL);
        });
      });
    } catch (eror) {
      console.log(eror);
    }
  };

  // dynamically upload pictures
  useEffect(() => {
    uploadImage();
    // eslint-disable-next-line
  }, [imagelogo]);

  // showing images
  const addHeaderImage = async (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImagelogo(readerEvent.target.result);
    };
  };

  const finalSubmission = async (e) => {
    if (userType === "consumer") {
      e.preventDefault();
      const tronweb = window.tronWeb;
      // const tPrice = tronweb.toSun(userData.tokenPrice);
      // const rate = tronweb.toSun(userData.rate);
      const { base58 } = window.tronWeb.defaultAddress;
      const address = tronweb.address.toHex(base58);
      await createUser(address, userName, userType, 0, imageDownload);
    } else {
      e.preventDefault();
      const tronweb = window.tronWeb;
      const tPrice = tronweb.toSun(userData.tokenPrice);
      const rate = tronweb.toSun(userData.rate);
      const { base58 } = window.tronWeb.defaultAddress;
      const address = tronweb.address.toHex(base58);
      const contract = await window.tronWeb
        .contract()
        .at("TYuNs7TZEGavhaVwBPfjzDSYC6sGjuXk7Q");

      const id = await contract.numberOfProsumer().call();
      const iD = tronweb.toDecimal(id);
      console.log(userData);

      const hash = await contract
        .createProsumer(address, userData.title, 1, tPrice, rate, imageDownload)
        .send({
          feeLimit: 1000000000,
          callValue: 0,
        });
      console.log(base58);
      console.log(hash);
      await createUser(address, userName, userType, iD, imageDownload);
    }
  };

  return (
    <div className="lg:h-[100vh] grid grid-cols-8">
      <div className="col-span-4 flex items-center justify-center flex-col">
        <img src={logo} alt="abuadenergy" className="w-[350px]" />
        <p className="text-[40px] font-Alkalami">Welcome to TRONPOWER</p>
        <p className="text-[13px]">Complete your account registeration</p>
      </div>
      <div className="col-span-4 flex flex-col items-center justify-center">
        <form className=" bg-slate-300 font-Alkalami p-2 rounded-sm shadow-2xl py-[2rem]">
          <div className=" px-[2rem] h-[30vh] flex items-center space-x-6">
            <div className="">
              {imagelogo ? (
                <img
                  src={imagelogo}
                  alt=""
                  className="w-[180px] h-[180px] p-[2rem] border-t-2 border-green-500 border-x-2"
                />
              ) : (
                <div className="w-[180px] h-[180px] p-[2rem] border-t-2 border-green-500 border-x-2">
                  <img src={demoImage} alt="" />
                </div>
              )}
              <input
                ref={imagePicker}
                hidden
                onChange={addHeaderImage}
                type="file"
                accept=".jpg, .jpeg, .png"
              />
              <div
                className="upload_add_img"
                onClick={() => imagePicker.current.click()}
              >
                <p className="cursor-pointer bg-[#78c621] text-slate-100 rounded-sm text-[13px] text-center p-1">
                  Upload your store Logo
                </p>
              </div>
            </div>
            {userType === "prosumer" || userType === "producer" ? (
              <>
                <div className="space-y-4 font-sans">
                  <div className="px-[2rem] text-[13px] rounded-sm">
                    <p className="">Company Name</p>
                    <input
                      required
                      onChange={(e) =>
                        setUserData({ ...userData, title: e.target.value })
                      }
                      type="text"
                      placeholder="Company Name"
                      className="px-2 p-1 text-[13px] w-[200px]"
                    />
                  </div>
                  <div className="px-[2rem] text-[13px] rounded-sm">
                    <p className="">PriceInKwh</p>
                    <input
                      required
                      onChange={(e) =>
                        setUserData({ ...userData, priceInKwh: e.target.value })
                      }
                      type="number"
                      placeholder="price in kwh default is 1"
                      className="px-2 p-1 text-[13px] w-[200px]"
                    />
                  </div>
                  <div className="px-[2rem] text-[13px] rounded-sm">
                    <p className="">Token Price</p>
                    <input
                      required
                      onChange={(e) =>
                        setUserData({ ...userData, tokenPrice: e.target.value })
                      }
                      type="number"
                      placeholder="token price"
                      className="px-2 p-1 text-[13px] w-[200px]"
                    />
                  </div>
                  <div className="px-[2rem] text-[13px] rounded-sm">
                    <p className="">Rate</p>
                    <input
                      required
                      onChange={(e) =>
                        setUserData({ ...userData, rate: e.target.value })
                      }
                      type="number"
                      placeholder="rate"
                      className="px-2 p-1 text-[13px] w-[200px]"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="px-[2rem] text-[13px] rounded-sm">
                  <p className="">Username</p>
                  <input
                    onChange={(e) => setUserName(e.target.value)}
                    type="text"
                    placeholder="username"
                    className="px-2 p-1 text-[13px] w-[200px]"
                  />
                </div>
              </>
            )}
          </div>
          <div className="space-x-3 p-2">
            <label>PRODUCER</label>
            <input
              type="radio"
              value="producer"
              name="radBtn"
              onChange={(e) => setUserType(e.target.value)}
            />
            <label>CONSUMER</label>
            <input
              type="radio"
              value="consumer"
              name="radBtn"
              onChange={(e) => setUserType(e.target.value)}
            />
            <label>PROSUMER</label>
            <input
              type="radio"
              value="prosumer"
              name="radBtn"
              onChange={(e) => setUserType(e.target.value)}
            />
          </div>
          <div>
            <p
              className="text-center my-3 bg-[#78c621] mx-[10%] text-slate-200 p-1 cursor-pointer"
              onClick={finalSubmission}
            >
              Complete account
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
