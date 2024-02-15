/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import myUrl from "../URL/myUrl";
import users from "./user";
const Admin = () => {
  const rUrl = myUrl;
  const [formDataList, setFormDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("ID");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  useEffect(() => {
    // Fetch data from the server when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${rUrl}/api/data`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFormDataList(data.formDataList);
        } else {
          console.error("Error fetching form data:", data.msg);
        }
      } else {
        console.error("Error fetching form data. HTTP error:", response.status);
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  };

  const generateDriveDownloadLink = (fileId) => {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleDelete = async (formDataId) => {
    try {
      const response = await axios.delete(`${rUrl}/api/data/${formDataId}`);

      // If deletion was successful, update the local state
      if (response.data.success) {
        setFormDataList((prevData) =>
          prevData.filter((formData) => formData.ID !== formDataId)
        );
        console.log("Data deleted successfully:", response.data);
      } else {
        console.error("Error deleting data:", response.data.msg);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  useEffect(() => {
    const storedLoggedIn = sessionStorage.getItem("loggedIn");
    if (storedLoggedIn === "true") {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("loggedIn", loggedIn);
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn]);
  const handleLogin = () => {
    const user = users.find(
      (user) => user.userName === username && user.userPassword === password
    );
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
      alert("Invalid credentials. Please try again.");
    }
  };
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">Login</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="email"
                      name="email"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="rounded-lg peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Email address"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email Address
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-lg p-5 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Password"
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-5 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <button
                      onClick={handleLogin}
                      className="bg-cyan-500 ml-20 text-white rounded-md px-5 py-1"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sortedData = [...formDataList].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    const order = sortOrder === "asc" ? 1 : -1;

    if (fieldA < fieldB) return -1 * order;
    if (fieldA > fieldB) return 1 * order;
    return 0;
  });

  const filteredData = sortedData.filter(
    (formData) =>
      formData.ID &&
      searchTerm &&
      formData.ID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unfilteredData = sortedData.filter(
    (formData) => !filteredData.includes(formData)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Admin Page</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by ID"
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border border-gray-300 mr-2"
        />
        <button
          onClick={() => handleSort("ID")}
          className="bg-blue-500 text-white p-2"
        >
          Sort by ID
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-5 border-b">ID</th>
            <th className="py-2 px-5 border-b">Name</th>
            <th className="py-2 px-5 border-b">Father's Name</th>
            <th className="py-2 px-5 border-b">Mother's Name</th>
            <th className="py-2 px-5 border-b">Address</th>
            <th className="py-2 px-5 border-b">Email</th>
            <th className="py-2 px-5 border-b">Acting Role</th>
            <th className="py-2 px-5 border-b">Mobile Number</th>
            <th className="py-2 px-5 border-b">WhatsApp Number</th>
            <th className="py-2 px-2 border-b">Status</th>
            <th className="py-2 px-2 border-b">Videos</th>
            <th className="py-2 px-2 border-b">Del</th>
            <th className="py-2 px-5 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((formData) => (
            <tr key={formData.id} className="border-b">
              <td className="text-[10px]  py-2 px-2 ">{formData.ID}</td>
              <td className="text-[10px] py-2 px-2 ">{formData.Name}</td>
              <td className="text-[10px] py-2 px-2 ">{formData.FatherName}</td>
              <td className="text-[10px] py-2 px-2 ">{formData.MotherName}</td>
              <td className="text-[10px] py-2 px-2 ">{formData.Address}</td>
              <td className="text-[10px] py-2 px-2 ">{formData.email}</td>
              <td className="text-[10px] py-2 px-2 ">{formData.ActingRole}</td>
              <td className="text-[10px] py-2 px-2 ">
                {formData.MobileNumber}
              </td>
              <td className="text-[10px] py-2 px-2 ">
                {formData.WhatsAppNumber}
              </td>
              <td className="text-[10px] py-2 px-2 ">{formData.status}</td>
              <td className="text-[10px] py-2  ">
                <a
                  href={generateDriveDownloadLink(formData.VideoUpload)} // Assuming VideoUpload holds the file ID
                  download
                  className="text-blue-500 hover:underline"
                >
                  Download
                </a>
              </td>
              <td className="text-[10px] py-2 text-center">
                <button
                  className="text-red-700"
                  onClick={() => handleDelete(formData.ID)}
                >
                  Delete
                </button>
              </td>
              <td className="text-[10px] py-2 px-4">
                {formatDate(formData.createdAt)}
              </td>
            </tr>
          ))}
          {unfilteredData.map((formData) => (
            <tr key={formData.id} className="border-b">
              <td className="text-[10px] py-2 px-2 ">{formData.ID}</td>
              <td className="text-[10px] py-2 px-2 ">{formData.Name}</td>
              <td className="text-[10px] py-2 px-2 ">{formData.FatherName}</td>
              <td className="text-[10px] py-2 px-2 ">{formData.MotherName}</td>
              <td className="text-[10px] py-2 px-2 ">{formData.Address}</td>
              <td className="text-[10px] py-2 px-2 ">{formData.email}</td>
              <td className="text-[10px] py-2 px-2 ">{formData.ActingRole}</td>
              <td className="text-[10px] py-2 px-2 ">
                {formData.MobileNumber}
              </td>
              <td className="text-[10px] py-2 px-2 ">
                {formData.WhatsAppNumber}
              </td>
              <td className="text-[10px] py-2 px-2 ">{formData.status}</td>
              <td className="text-[10px] py-2 px-2 ">
                <a
                  href={generateDriveDownloadLink(formData.VideoUpload)} // Assuming VideoUpload holds the file ID
                  download
                  className="text-blue-500 hover:underline"
                >
                  +
                </a>
              </td>

              <td className="text-[10px] py-2 px-2">
                <button
                  className="text-red-700"
                  onClick={() => handleDelete(formData.ID)}
                >
                  -
                </button>
              </td>
              <td className="text-[10px] py-2 px-4">
                {formatDate(formData.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
