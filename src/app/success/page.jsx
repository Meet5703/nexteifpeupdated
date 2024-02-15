/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import logoimg from "../../assets/GettyImages-138596308-ad71719.webp";
import axios from "axios";
let html2pdf;

if (typeof window !== "undefined") {
  html2pdf = require("html2pdf.js");
}
// ...
import myUrl from "../URL/myUrl";
import Image from "next/image";
const Page = () => {
  const rUrl = myUrl;
  const [data, setData] = useState({
    ID: "",
    Name: "",
    ActingRole: "",
    email: "",
    status: ""
  });

  useEffect(() => {
    const fetchSubmittedDetails = async () => {
      try {
        const response = await axios.get(`${rUrl}/api/data`);
        const formDataList = response.data.formDataList;

        if (formDataList && formDataList.length > 0) {
          const latestSubmission = formDataList[formDataList.length - 1];

          setData({
            ID: latestSubmission.ID,
            Name: latestSubmission.Name,
            ActingRole: latestSubmission.ActingRole,
            email: latestSubmission.email,
            status: latestSubmission.status
          });
        }
      } catch (error) {
        console.error("Error fetching submitted details:", error);
      }
    };

    fetchSubmittedDetails(); // Call fetchSubmittedDetails immediately
  }, []);

  const handleUpdateData = async () => {
    try {
      const response = await axios.put(`${rUrl}/api/data/${data.ID}`, {
        // Specify the data you want to update here
        // For example, if you want to update the 'status' field, you can do:
        // status: 'UpdatedStatus'
      });

      console.log("Data updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  useEffect(() => {
    if (data.ID) {
      // Check if data is available before calling downloadPDF
      downloadPDF();
    }
  }, [data.ID]);

  let isPDFDownloaded = false; // Define isPDFDownloaded outside downloadPDF function

  const downloadPDF = async () => {
    try {
      if (isPDFDownloaded) return; // Check if PDF has already been downloaded

      const element = document.getElementById("pdf-content");
      const pdfBlob = await html2pdf(element, {
        margin: 10,
        filename: "receipt.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      });

      const pdfDataURL = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(pdfBlob);
      });

      const link = document.createElement("a");
      link.href = pdfDataURL;
      link.download = "receipt.pdf";
      link.click();

      isPDFDownloaded = true; // Set the flag to indicate PDF has been downloaded
    } catch (error) {
      console.error("Error generating and downloading PDF:", error);
    }
  };

  handleUpdateData();

  return (
    <div>
      <div className="w-full h-full grid grid-cols-12">
        <div
          id="pdf-content"
          className=" bg-blue-100 h-fit col-start-3 col-end-11 p-8"
        >
          <div className="w-full flex justify-around items-center">
            <Image
              src={logoimg}
              alt="logo"
              className="w-[100px] h-[100px] rounded-full"
              width={100}
              height={100}
            />
            <h1 className="text-xl md:text-3xl uppercase font-bold ">
              E.I.F.P.E
            </h1>
            <Image
              src={logoimg}
              alt="logo"
              className="w-[100px] h-[100px] rounded-full"
              width={100}
              height={100}
            />
          </div>
          <div className="w-full flex justify-around items-center">
            <h1 className="text-xl md:text-3xl uppercase font-bold ">
              Receipt Of Application
            </h1>
          </div>
          <div className="w-full flex justify-between items-center mt-20 bg-white border border-black p-6">
            <div className="text-justify w-fit">
              <h1 className="uppercase font-bold text-lg md:text-xl">
                Application Details
              </h1>
              <div>
                <h1>From:- EIFPE</h1>
                <h1>To:- {data.Name}</h1>
                <h1>UID:- {data.ID}</h1>
                <h1>Applied For :- {data.ActingRole}</h1>
              </div>
            </div>
            <div className="w-1/4">
              <h1 className="uppercase font-bold text-lg md:text-xl">
                Address
              </h1>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Obcaecati, iure!
              </p>
            </div>
          </div>
          <div className="mt-20 bg-white p-8 border border-black">
            <h1 className="uppercase font-bold text-lg md:text-xl text-center">
              Details Of Purchase
            </h1>

            <br />
            <div className="flex justify-between">
              <h1 className="px-10 text-xl font-semibold">Items Purchased</h1>
              <h1 className="px-10 text-xl font-semibold">Amount</h1>
            </div>
            <br />

            <div className="space-y-3 border border-black">
              <div className="flex justify-between px-10  py-3 ">
                <h1>Apply Form Fees </h1>
                <h1>1000Rs.</h1>
              </div>
              <hr className="border-b-0 border-black" />
              <div className="flex justify-between py-3 px-10">
                <h1>Audition Fees </h1>
                <h1>5000Rs.</h1>
              </div>
            </div>
            <br />
            <div>
              <div className="flex justify-between px-10">
                <h1>Total Amt. </h1>
                <h1>6000Rs.</h1>
              </div>
            </div>
          </div>
          <div className="mt-14 bg-white p-4 border border-black">
            <h1 className="text-center text-xl font-bold underline">
              Contact us
            </h1>
            <div className="flex justify-between">
              <span>Ph.1 :- 7985350778</span>
              <span>Ph.2 :- 8853518482</span>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-center row-start-2 col-start-10">
          <button
            onClick={downloadPDF}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
