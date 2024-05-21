"use client";
import React, { useState, useEffect, useMemo } from "react";
import data from "@/components/tables/mockData.json";
import DataTable from "@/components/tables/dataTable";
import { Role, AccountStatus } from "@/utils/staticData";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import DataTableid from "@/components/idAcess/idAccess";
import Pagination from "@/components/pagination/pagination";
import Addcategory from "@/components/clientCategoryManagement/AddClientCategory"
 const ClientCategoryManagement = () => {
const [clientData, setClientData] = useState(null);
const [modalOpen, setModalOpen] = useState(false);

 

  const fetchData = async () => {
    console.log("account verification page mounted");

    try {
      const response = await axiosInstance.get(
        `http://13.232.152.20/api/v1/yms/clientorg/cat/`
      );

      console.log("responce",response);
      
      setClientData(response.data?.clientCategory);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ClientColumn = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Description",
        accessorKey: "description",
      },

      {
        id: "id",
        header: "View User",
        cell: ({ row }) => View(row),
      },
    ],
    []
  );

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
  };
  

  return (
    <div className="w-full p-2 ">
      <h1 className="text-center font-roboto text-lg font-bold py-4 uppercase">
        Manage Client Category
      </h1>
      <div className="text-end mx-4 ">
        
          <button
            onClick={handleModalOpen}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Add Client
          </button>
          {modalOpen && <Addcategory onClose={handleModalClose} />}
        </div> 
      <div>
        {clientData && <DataTable data={clientData} columns={ClientColumn} />}
      </div>
    </div>
  );
};

export default ClientCategoryManagement;

const View = (row) => {
  // console.log("view", row);
  return (
    <div>
      <Link href={`/clientCategoryManagement/${row.original.id}`}>View</Link>
    </div>
  );
};
