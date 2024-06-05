"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import DataTable from "@/components/tables/dataTable";

import Link from "next/link";
import axiosInstance from "@/utils/axios";

import Loading from "@/app/(home)/(superAdmin)/loading";
import toast from "react-hot-toast";

import { MdOutlineViewHeadline } from "react-icons/md";
import CreateClientLevelOrg from "@/components/superAdmin/organisationManagement/clientLevelOrg/addClientLevelOrgs";
import Pagination from "@/components/pagination/pagination";
import { Country, State, states } from "@//utils/staticData";
import CreateYard from "./createYard";
import {
  formStyle,
  inputStyle,
  labelStyle,
  loginInputStyle,
} from "../../../../components/ui/style";
const AllYards = () => {
  const [filteredData, setFilteredData] = useState(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initially set to true to show loading spinner
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [filterDistricts, setFilterDistricts] = useState([]);
  const [selectDistrict, setSelectDistrict] = useState("");
  const stateDropdownRef = useRef(null);
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.get(
        `/yard?page=1&limit=10&country=INDIA&state=${selectedState}&district=${selectDistrict}`
      );
      // console.log("all users", response?.data?.res?.yard);
      setFilteredData(response?.data?.res?.yard);

      setSuccess({
        text: response?.data?.message,
      });
    } catch (error) {
      setError({
        text: error?.response?.data?.message,
      });
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("filt", filteredData);
  useEffect(() => {
    fetchData(); // Call fetchData directly inside useEffect
  }, [selectedState, selectDistrict]);
  const UsersData = filteredData || [];

  const userColumn = useMemo(
    () => [
      {
        header: "yard name",
        accessorKey: "yard_name",
      },
      {
        header: "state",
        accessorKey: "state",
      },
      {
        header: "district",
        accessorKey: "district",
      },
      {
        header: "Code",
        accessorKey: "code",
      },

      {
        id: "viewUser",
        header: "View User",
        cell: ({ row }) => View(row),
      },
    ],
    [filteredData]
  );

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    // console.log("selectedState from handle change",selectedState);

    setSelectedState(selectedState);
    const stateData = states.find((state) => state.state === selectedState);
    console.log("selected state from state array", stateData);

    !selectedState && setFilterDistricts([]);

    stateData ? setFilterDistricts(stateData.districts) : [];
    setSelectDistrict("");
  };

  const handleDistricChange = (e) => {
    setSelectDistrict(e.target.value);
  };

  // const handleReset =()=>{
  //   setSelectedState("");
  //   setSelectDistrict("");
  //   setFilterDistricts([]);
  //   fetchData();
  //   if (stateDropdownRef.current) {
  //     stateDropdownRef.current.value = '';
  //   }
  // }

  return (
    <div className="mt-8  ">
      <h1 className="text-center font-bold uppercase text-lg  mb-3 pb-1">
        Yard Organization
      </h1>
      <div className="grid grid-cols-3 px-20 items-center  gap-4">
        {/*  */}
        <div className="flex flex-col w-24  ">
          <label htmlFor="state" className={labelStyle?.data}>
            Select State
          </label>
          <select
            id="state"
            className={inputStyle?.data}
            defaultValue=""
            onChange={handleStateChange}
            ref={stateDropdownRef}
          >
            <option>Select State</option>
            <option value="">ALL STATE</option>

            {states.map((option, index) => (
              <option key={index} value={option.state}>
                {option.state}
              </option>
            ))}
          </select>
          {/* {errors.state && (
              <p className="text-red-500">State is required</p>
                          )} */}
        </div>

        <div className="flex flex-col w-24">
          <label htmlFor="district" className={labelStyle?.data}>
            Select District
          </label>
          <select
            id="district"
            className={inputStyle?.data}
            defaultValue=""
            onChange={handleDistricChange}
          >
            <option value="" disabled hidden>
              Select District
            </option>
            {filterDistricts.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {/* {errors.state && (
    <p className="text-red-500">State is required</p>
  )} */}
        </div>
        <div className="self-end justify-self-end mb-1 flex gap-5">
          {/* <button
            // href={`/userManagement/createUser`}
            onClick={handleReset}
            className="bg-red-500 text-white py-2 h-10 px-4 rounded hover:bg-red-600 transition duration-200"
          >
            Reset
          </button> */}
          <button
            // href={`/userManagement/createUser`}
            onClick={handleModalOpen}
            className="bg-blue-500 text-white py-2 h-10 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Create Yard
          </button>
          {modalOpen && (
            <CreateYard fetchYard={fetchData} onClose={handleModalClose} />
          )}
        </div>
      </div>

      {filteredData && <DataTable data={UsersData} columns={userColumn} />}
    </div>
  );
};

export default AllYards;

const View = (row) => {
  // console.log("from view", row.original.id);
  return (
    <div className="flex justify-center items-center border space-x-1 bg-gray-700 text-white p-1 rounded-md ">
      <p>
        <MdOutlineViewHeadline />
      </p>
      <Link
        href={`/organisationManagement/yardManagement/${row.original.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className=""
      >
        View
      </Link>
    </div>
  );
};
