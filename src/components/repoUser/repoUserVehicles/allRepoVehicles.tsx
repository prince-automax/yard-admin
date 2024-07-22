"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import DataTable from "@/components/tables/dataTable";
import Link from "next/link";
import axiosInstance from "@/utils/axios";
import { MdOutlineViewHeadline } from "react-icons/md";
import Pagination from "@/components/pagination/pagination";
import { inputStyle, labelStyle } from "@/components/ui/style";
import NoVehicleMessage from "@/components/commonComponents/clientLevelUser/noVehicle";
import mockData from "@/components/tables/vehicleData.json";
import {
  CategoryFilter,
  CityFilter,
  ClientFilter,
  StateFilter,
  Search,
} from "@/components/reuseableComponent/filter/filters";
import RequestForRepo from "../availableForYard/requestForRepo";

const AllRepoVehicles = () => {
  const [filteredData, setFilteredData] = useState(null);
  const [page, setPage] = useState(1);
  //   const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initially set to true to show loading spinner
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleCategory, setAllVehicleCategory] = useState([]);
  const [Category, setCategory] = useState(null);
  const [catFilter, setCatFilter] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState("");
  const [limit, setLimit] = useState(5);
  const [searchVehicle, setSearchVehicle] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const fetchVehicles = async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: page?.toString(),
        limit: limit?.toString(),
      });

      if (Category) {
        params.append("vehicle_category_id", Category);
      }

      if (vehicleStatus) {
        params.append("status", vehicleStatus);
      }

      const response = await axiosInstance.get(
        `/vehicle/?${params.toString()}`
      );
      console.log("res", response);

      setFilteredData(response?.data?.res);
    } catch (error) {
      setError({
        text: error?.response?.data?.message,
      });
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleEditClick = (userId) => {
    setSelectedUserId(userId);
    setEditModalOpen(true);
  };



  const handleEditModalClose = () => {
    setEditModalOpen(false);
    // setSelectedUserId(null);
  };
  const FetchAllVehicleCategory = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/Vehicle/cat`);
      console.log("cat", response);

      setAllVehicleCategory(response?.data?.vehicleCategory);
    } catch (error) {
      // toast.error("Failed to fetch vehicle categories");
      console.log(error);
    }
  }, []);

  const vehicleCategorys = vehicleCategory?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  useEffect(() => {
    fetchVehicles();
    FetchAllVehicleCategory(); // Call fetchData directly inside useEffect
  }, [Category, page, vehicleStatus]);

  const UsersData = mockData;

  const userColumn = useMemo(
    () => [
      {
        header: "make",
        accessorKey: "make",
        // id: "clsup_org_category_name", // Ensure unique id
      },
      {
        header: "model",
        accessorKey: "model",
        // id: "clsup_org_category_name", // Ensure unique id
      },
      {
        header: "color",
        accessorKey: "color",
        // id: "clsup_org_name", // Ensure unique id
      },

      {
        header: "Body type ",
        accessorKey: "body_type",
        // id: "clsup_org_name", // Ensure unique id
      },

      {
        header: "View",
        cell: ({ row }) => View(row),
      },
      
    ],
    [filteredData]
  );

  const handleCatChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    const selectedOption = e.target.options[e.target.selectedIndex];
    setCatFilter(selectedOption.text);
  };
  const handleOwnershipStatus = (e) => {
    const value = e.target.value;
    setVehicleStatus(value);
  };

  return (
    <div className="w-full">
      <h1 className="text-center font-roboto text-lg font-bold py-2 uppercase">
        All Repo Vehicles
      </h1>
      <div className="flex w-full">
        <div className="w-full  grid grid-cols-3 place-content-center gap-4">
          <div className="flex flex-col w-40  ml-5">
            <label htmlFor="state" className={labelStyle?.data}>
              Select Client
            </label>
            <select
              id="Client"
              className={inputStyle?.data}
              defaultValue=""
              onChange={handleCatChange}
            >
              <option value="">All Category</option>

              {vehicleCategorys.map((option, index) => (
                <option key={index} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          <CategoryFilter
            label="select State"
            handleCatChange={handleCatChange}
            options={vehicleCategorys}
          />
          <CategoryFilter
            label="select City"
            handleCatChange={handleCatChange}
            options={vehicleCategorys}
          />
          <div>
            <Search
              label="Search by vehcile reg"
              setSearchVehicle={setSearchVehicle}
              placeholder="search by Reg No"
            />
          </div>
        </div>
        {/* <ClientFilter/>
        <StateFilter/>
        <CityFilter/> */}
      </div>
      {/* <div className="border  flex  mt-4">
        
        <div className="flex justify-end w-full h-fit">
          <Link
            href={`/vehicle/addvehicle`}
            // onClick={handleModal}
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-200 mb-1 mr-6"
          >
            Add
          </Link>
        </div>
      </div> */}
      
      <div>
        {filteredData?.totalCount < 1 ? (
          <NoVehicleMessage typeFilter="Vehicles" catFilter={catFilter} />
        ) : (
          <div className="w-full">
            <DataTable data={UsersData} columns={userColumn} />

            <div className="w-full text-center">
              {filteredData?.totalCount > 0 && (
                <Pagination
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  totalDataCount={filteredData?.totalCount}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRepoVehicles;

const View = (row) => {
  // console.log("from view", row.original.id);
  return (
    <div className="flex justify-center items-center border space-x-1 w-20 bg-gray-700 text-white p-1 rounded-md ">
      <p>
        <MdOutlineViewHeadline />
      </p>
      <Link
        href={`/repoUserVehicles/${row.original.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className=""
      >
        View
      </Link>
    </div>
    
  );
};

