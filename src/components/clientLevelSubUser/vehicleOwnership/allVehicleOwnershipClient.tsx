"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import DataTable from "@/components/tables/dataTable";
import { Role, VehicleState } from "@/utils/staticData";
import Link from "next/link";
import axiosInstance from "@/utils/axios";
import CreateUserModal from "@/components/superAdmin/UserManagment/createUser";
import { RoleSelect } from "@/components/commonComponents/role";
import Loading from "@/app/(home)/(superAdmin)/loading";
import toast from "react-hot-toast";
import { FaUserSlash, FaUser, FaRegEye } from "react-icons/fa";
import { FaUserLargeSlash, FaUserLarge } from "react-icons/fa6";
import { GrFormView } from "react-icons/gr";
import { MdOutlineViewHeadline } from "react-icons/md";
import AddParkFee from "@/components/yardManager/parkFee/addParkFee";
import Pagination from "@/components/pagination/pagination";
import { inputStyle, labelStyle } from "@/components/ui/style";
import NoVehicleMessage from "@/components/commonComponents/clientLevelUser/noVehicle";

const AllVehicleOwnershipClient = () => {
  const [filteredData, setFilteredData] = useState(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initially set to true to show loading spinner
  const [vehicleStatus, setVehicleStatus] = useState('');
  const [Category, setVehiclecat] = useState('');
  const [allyard, setAllYard] = useState([]);
  const [selectedYard, setSelectedYard] = useState('');
  const [allVehicleOwnerships,setAllVehicleOwerships]=useState([])
  const [limit, setLimit] = useState(5);
  const [yardFilter, setYardFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const FetchAllYards = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/yard`);

    //   console.log("all yards", response?.data?.res?.yard);
      setAllYard(response?.data?.res?.yard);
     
    } catch (error) {
      // toast.error(error?.response?.data?.message);
      console.log("error",error);
      
    }
  }, []);

  const FetchAllVehicleOwnerships = useCallback(async () => {
   
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),

          });
        //   params?.
         
          if (selectedYard) {
            params.append('yard_id',selectedYard);
          }
          if(vehicleStatus){
            params.append('status',vehicleStatus);

          }

        //   const response = await axiosInstance.get(`/ownership/?${params.toString()}`);

      const response = await axiosInstance.get(
        `ownership/client/?${params.toString()}`
      );
       
      setAllVehicleOwerships(response?.data?.res?.vehicleOwnership)
         
      // console.log( "api", `ownership/client/?${params.toString()}` );
      setFilteredData(response?.data?.res?.totalCount);
      console.log("response of vehicle ownership00001", response);
    } catch (error) {
      console.log("error",error);
      
    } finally {
    }
  }, [page, Category, selectedYard,selectedYard, vehicleStatus]);

  const allYardsOptions = allyard?.map((item) => ({
    value: item?.id,
    label: item?.yard_name,
  }));

  // console.log("allYardsOptions",allYardsOptions);
  

  

  // console.log("vehicleCategorysOptions",vehicleCategorysOptions);
  

  // console.log("selectedDAta", "yard=",selectedYard, "vehiclecat=",Category, vehicleStatus);
  // console.log("selectedDAta", "yard=",typeof(selectedYard), "vehiclecat=",typeof(Category), typeof(vehicleStatus));


  useEffect(() => {
    FetchAllVehicleOwnerships();
  }, [selectedYard, Category, vehicleStatus,page]);

  useEffect(() => {
   

    FetchAllYards();
  }, []);

  const UsersData = allVehicleOwnerships || [];

  console.log("allVehicleOwnerships",allVehicleOwnerships);
  

  const userColumn = useMemo(
    () => [

      {
        header: "Client Organisation ",
        accessorKey: "cl_org.cl_org_name",
        // id: "clsup_org_category_name", // Ensure unique id
      },
      {
        header: "Vehicle Category  ",
        accessorKey: "vehicle.vehicle_category.name",
        // id: "clsup_org_name", // Ensure unique id
      },
      {
        header: "Make ",
        accessorKey: "vehicle.make",
        // id: "clsup_org_name", // Ensure unique id
      },
      {
        header: "Model  ",
        accessorKey: "vehicle.model",
        // id: "clsup_org_name", // Ensure unique id
      },
      {
        header: "Code  ",
        accessorKey: "vehicle.code",
        // id: "clsup_org_name", // Ensure unique id
      },
      
      {
        header: "Yard Name  ",
        accessorKey: "vehicle.yard.yard_name",
        // id: "clsup_org_name", // Ensure unique id
      },

      {
        header: "status ",
        accessorKey: "status",
        // id: "code", // Ensure unique id
      },
      
      
      {
        
        header: "View",
        cell: ({ row }) => View(row),
      },
    ],
    [filteredData]
  );


  // console.log("filetered data from clientLevelSuperOrg",filteredData);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
 
  const handleYardSelection = (e) => {
    const value = e.target.value;
    setSelectedYard(value);
    const selectedOption = e.target.options[e.target.selectedIndex];
    setYardFilter(selectedOption.text);
  };
  const handleOwnershipStatus = (e) => {
    const value = e.target.value;
    setVehicleStatus(value);
  };
  return (
    <div className="w-full">
      <h1 className="text-center font-roboto text-lg font-bold py-2 uppercase">
        Vehicle Ownership
      </h1>

  <div className="flex w-full space-x-14 borde">
  
      <div className="flex flex-col   ml-5">
        <label htmlFor="state" className={labelStyle?.data}>
          Select Yard
        </label>
        <select
          id="state"
          className={inputStyle?.data}
          defaultValue=""
          onChange={handleYardSelection}
        >
          <option value="">All Category</option>
          {/* <option value="">ALL STATE</option> */}

          {allYardsOptions.map((option, index) => (
            <option key={index} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>
        {/* {errors.state && (
              <p className="text-red-500">State is required</p>
                          )} */}
      </div>
      
      <div className="flex flex-col   ml-8">
        <label htmlFor="state" className={labelStyle?.data}>
        Select Status
        </label>
        <select
          id="state"
          className={inputStyle?.data}
          defaultValue=""
          onChange={handleOwnershipStatus}
        >
          <option value="">Select Status</option>
          {/* <option value="">ALL STATE</option> */}

          {VehicleState.map((option, index) => (
            <option key={index} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>
        {/* {errors.state && (
              <p className="text-red-500">State is required</p>
                          )} */}
      </div>
  </div>
      
      <div>
        {filteredData < 1 ? (
          <NoVehicleMessage typeFilter="Vehicle"   yardFilter={yardFilter} statusFilter={vehicleStatus}/>
        ) : (
          <div className="w-full">
             
              <DataTable data={UsersData} columns={userColumn} />
            
            <div className="w-full text-center">
               {filteredData > 0 && (
                <Pagination
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  totalDataCount={filteredData}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllVehicleOwnershipClient;

const View = (row) => {
  // console.log("from view", row.original.id);
  return (
    <div className="flex justify-center items-center border space-x-1 bg-gray-700 text-white p-1 px-2 rounded-md ">
      <p>
        <MdOutlineViewHeadline />
      </p>
      <Link
        href={`/vehicleSubOwnership/${row.original.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className=""
      >
        View
      </Link>
    </div>
  );
};
