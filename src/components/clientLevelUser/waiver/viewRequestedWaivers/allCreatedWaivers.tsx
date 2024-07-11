"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/utils/axios';
import {
  getSortedRowModel,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { MdOutlineViewHeadline } from 'react-icons/md';
import Link from 'next/link';

import { PiSortAscendingLight, PiSortDescendingLight } from 'react-icons/pi';
import { TbSelector } from 'react-icons/tb';
import { CiSearch } from 'react-icons/ci';

import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import IndeterminateCheckbox from '@/components/tables/IndeterminateCheckbox';
import { inputStyle, labelStyle } from '@/components/ui/style';
import Pagination from '@/components/pagination/pagination';
import { VehicleState } from '@/utils/staticData';
import IndividualCreatedWaiver from './individualCreatedWaiver';
import NoVehicleMessage from '@/components/commonComponents/clientLevelUser/noVehicle';
import Loading from '@/app/(home)/(superAdmin)/loading';

type User = {
  fee_per_day: number;
  status: string;
  id: string;
  waiver: { code: string };
  vehicle_ownership: {
    cl_org: {
      code: string;
      cl_org_name: string;
    };
    vehicle: {
      code: string;
      make: string;
      model: string;
      yard: { yard_name: string };
      status: string;
      vehicle_category: { name: string };
    };
  };
};

const AllCreatedWaivers = () => {
  const [sorting, setSorting] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState<User[]>([]);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [vehicleCategory, setAllVehicleCategory] = useState([]);
  const [yardData, setYardData] = useState([]);
  const [yardFilter, setYardFilter] = useState('');
  const [vehicleCategoryFilter, setVehicleCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [clientLevelOrg, setClientLevelOrg] = useState([]);
  const [client, setClient] = useState("");
  const [limit,setLimit]=useState(5)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [catFilter, setCatFilter] = useState("");
  const [yardFilter2, setYardFilter2] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const FetchAllVehicleCategory = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/Vehicle/cat`);
      setAllVehicleCategory(response?.data?.vehicleCategory);
      
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("error",error);
    }
  }, []);

  const fetchYard = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/yard`);
      setYardData(response?.data?.res?.yard);
      
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error fetching data:", error);
    }
  }, []);



  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: pages.toString(),
        limit: '5',
      });

      if (yardFilter) {
        params.append('yard_id', yardFilter);
      }

      if (vehicleCategoryFilter) {
        params.append('vehicle_category_id', vehicleCategoryFilter);
      }

      // if (client) {
      //   params.append('client_id', client);
      // }

      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await axiosInstance.get(`/waiver/client?${params.toString()}`);
      setData(response?.data?.res?.waiverVehicles || []);
      setPageCount(response?.data?.res?.totalCount || null);
      console.log("response of vehicle ownership00001", response);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [pages, yardFilter, vehicleCategoryFilter, statusFilter]);

  useEffect(() => {
   
    fetchYard();
    FetchAllVehicleCategory();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pages, yardFilter, vehicleCategoryFilter, statusFilter ]);

  const handleRowSelection = (id: string) => {
    setSelectedRowIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((ids) => ids !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    // setSelectedUserId(null);
  };
 

  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <IndeterminateCheckbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler(),
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <div className="px-1">
      //       <IndeterminateCheckbox
      //         {...{
      //           checked: selectedRowIds.includes(row.original.id),
      //           onChange: () => handleRowSelection(row.original.id),
      //         }}
      //       />
      //     </div>
      //   ),
      // },
      {
        accessorKey: 'vehicle_ownership.vehicle.code',
        header: 'Vehicle Code',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'waiver.code',
        header: 'waiver Code',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'vehicle_ownership.vehicle.make',
        header: 'Make',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'vehicle_ownership.vehicle.model',
        header: 'Model',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'vehicle_ownership.vehicle.yard.yard_name',
        header: 'Yard Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'vehicle_ownership.vehicle.vehicle_category.name',
        header: 'Category',
        cell: (info) => info.getValue(),
      },
      {
        id: 'view',
        header: 'View',
        cell: ({ row }) => (
          <div className="flex justify-center ">
            <View row={row} onEditClick={handleEditClick} />
          </div>
        ),
      },
    ],
    [selectedRowIds]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sorting,
      globalFilter: globalFilter,
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleVehicleCategoryChange = (e) => {
    const value = e.target.value;
    setVehicleCategoryFilter(value);
    
    const selectedOption = e.target.options[e.target.selectedIndex];
    setCatFilter(selectedOption.text);
  };
  const handleYardChange = (e) => {
    const value = e.target.value;
    setYardFilter(value);
    const selectedOption = e.target.options[e.target.selectedIndex];
    setYardFilter2(selectedOption.text);
  };
 
  const handleOwnershipStatus = (e) => {
    
    
    
    setStatusFilter(e.target.value);
  };
  const handleOrgChange = (e) => {
    setClient(e.target.value);
  };
 const handleEditClick = (userId) => {
    setSelectedUserId(userId);
    setEditModalOpen(true);
  };
  return (
    <div className="w-full">
      <h1 className="text-center font-roboto text-lg font-bold py-2 uppercase">
       All created waivers
      </h1>
      <div className="grid grid-cols-3 pl-5 pt-5 items-center">
        <div className="mb-">
          <div className="flex flex-col w-24">
            <label htmlFor="yard" className={labelStyle?.data}>
              Select Yard
            </label>
            <select
              id="yard"
              className={inputStyle?.data}
              defaultValue=""
              onChange={handleYardChange}
            >
                <option value="">All Yards</option>
              {yardData.map((option, index) => (
                <option key={index} value={option.id}>
                  {option.yard_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-">
          <div className="flex flex-col ">
            <label htmlFor="vehicleCategory" className={labelStyle?.data}>
              Select Vehicle Category
            </label>
            <select
              id="vehicleCategory"
              className={inputStyle?.data}
              defaultValue=""
              onChange={handleVehicleCategoryChange}
            >
               <option value="">All Vehicle Categories</option>
              {vehicleCategory.map((option, index) => (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* <div className="flex flex-col">
          <label htmlFor="client" className={labelStyle?.data}>
            Select Client
          </label>
          <select
            id="client"
            className={inputStyle?.data}
            defaultValue=""
            onChange={handleOrgChange}
          >
            <option value="">All Clients</option>
            {clientLevelOrg.map((option, index) => (
              <option key={index} value={option.id}>
                {option.client_org_name}
              </option>
            ))}
          </select>
        </div> */}

        <div className="mb-">
          <div className="flex flex-col w-24">
            <label htmlFor="status" className={labelStyle?.data}>
              Select Status
            </label>
            <select
              id="status"
              className={inputStyle?.data}
              defaultValue=""
              onChange={handleOwnershipStatus}
            >
               <option value=''>All Status</option>
              { VehicleState.map((item,index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex w-full h-screen items-center justify-center"><Loading/></div>
      ) : (
        <div className="w-full p-5">
          {editModalOpen && (
            <div className="relative border ">
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
                <IndividualCreatedWaiver
                  waiverId={selectedUserId}
                  onClose={handleEditModalClose}
                  fetch={fetchData}
                />
              </div>
            </div>
          )}
          <div>
        {pageCount< 1 ? (
          <NoVehicleMessage typeFilter="Vehicles" catFilter={catFilter}  yardFilter={yardFilter2} statusFilter={statusFilter}/>
        ) : (
          <div className="w-full">
             
             <div className="mt-0.5">
            <div className="relative rounded-md shadow-sm max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CiSearch className="h-5 w-5 text-gray-800" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search"
                className="border w-44 focus:ring-indigo-500 focus:outline-none block  pl-10 rounded-md border-gray-400 p-1 placeholder:font-semibold"
              />
            </div>
          </div>
          <div className="mt-2 ring-1 w-full h-fit ring-gray-300 rounded-lg overflow-auto">
            <table className="min-w-full divide-y divide-gray-300 relative">
              <thead className="bg-gray-700 rounded-lg text-left">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="divide-x divide-gray-500">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="py-3.5 uppercase pl-1 pr-1 text-sm font-semibold text-gray-100 text-left sm:pl-2"
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center">
                            {flexRender(header?.column?.columnDef?.header, header.getContext())}
                            <div className="flex justify-center items-center pl-2">
                              {sorting.find((sort) => sort.id === header.id) ? (
                                sorting.find((sort) => sort.id === header.id).desc ? (
                                  <PiSortDescendingLight />
                                ) : (
                                  <PiSortAscendingLight />
                                )
                              ) : (
                                <TbSelector />
                              )}
                            </div>
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="text-black space-x-8">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="divide-x divide-gray-300 cursor-pointer hover:bg-indigo-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                      key={cell.id}
                      className="px-2 py-3.5 text-sm text-gray-800 border-t max-sm:font-bold border-gray-200 text-left"
                    >
                       <div className="justify-start flex">{flexRender(cell?.column?.columnDef?.cell, cell.getContext())}</div>
                    </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            
            <div className="w-full text-center">
            {pageCount >0 && (
              <Pagination page={pages} setPage={setPages} totalDataCount={pageCount} limit={limit}/>
            )}
          </div>
          </div>
        )}
      </div>
         
         
        </div>
      )}
    </div>
  );
};

export default AllCreatedWaivers;
const View = ({ row, onEditClick }) => {
  // console.log("row form category", row);

  return (
    <div
      onClick={() => onEditClick(row?.original?.id)}
      className="flex justify-center items-center py-2 px-4   space-x-2 bg-gray-700 rounded-md  text-white"
    >
      <p>
        <MdOutlineViewHeadline />
      </p>

      <span> View</span>
    </div>
  );
};
