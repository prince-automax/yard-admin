"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  FormFieldInput,
  SelectInput,
  ImageMaping,
  TextArea,
  InputField,
  SelectComponent,
} from "../../ui/fromFields";
import { formStyle } from "../../ui/style";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Link from "next/link";
import Loading from "@/app/(home)/(superAdmin)/loading";
type Inputs = {
  cl_org_id: string,
  vehicleOwnershipIds: string,
  fee_per_day: string,
  reason: string
};

const AddWaiver = ({onClose,selectedRowIds,client}) => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Initially set to true to show loading spinner
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  useEffect(() => {
    if (success) {
      toast.success(success.text ? success.text : "Success");
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    }
    if (error) {
      toast.error(
        error.text ? error.text : "Something went wrong. Please contact support"
      );
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  }, [success, error]);



  const AddVehicleCategory = async (data: Inputs) => {
    setIsLoading(true);
    try {
      const modifiedData = {
        ...data,
        cl_org_id:client,
        fee_per_day: parseInt(data?.fee_per_day),
        vehicleOwnershipIds:selectedRowIds
       
        
      }; console.log(modifiedData);
      const response = await axiosInstance.post(
        "waiver/create",
        modifiedData
      );
      console.log("Response:", response);
      setSuccess({
        text: response?.data?.message,
      });
      // router.push('/vehicleCategoryManagement');
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error("Error:", error.response);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
     
       
    }
  };
 
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center border-2 h-full w-full">
  //       <Loading />
  //     </div>
  //   );
  // }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div className="flex  w-full justify-between text-gray-400 uppercase text-lg border-b mb-5 pb-1">
          <h1 className=" font-bold  ">Assign Waiver</h1>
          <p className=" cursor-pointer"
           onClick={onClose}
           >
            x
          </p>
        </div>
        <form
          className={` flex flex-col items-center border rounded-xl py-8`}
          onSubmit={handleSubmit(AddVehicleCategory)}
        >
        

          {/* <div className="mb-">
          <SelectComponent
                label="Select Client Organisation"
                options={allClientLevelOrganisations}
                name="cl_org_id"
                register={register}
                errors={errors}
                required={true}
                defaultValue=""
              />
            </div> */}
            {/* <div className="mb-">
              <InputField
                label="Ownership"
                type="zstring"
                name="vehicleOwnershipIds"
                register={register}
                errors={errors}
                pattern=""
              />
            </div> */}
            <div className="mb-">
              <InputField
                label="Fee Per Day"
                type="number"
                name="fee_per_day"
                register={register}
                errors={errors}
                pattern=""
              />
            </div>
            <div className="mb-">
              <InputField
                label="Reason"
                type="zstring"
                name="reason"
                register={register}
                errors={errors}
                pattern=""
              />
            </div> 

          <div className="w-32 mt-4">
            <button
              type="submit"
              className="bg-[#333333] text-white px-4 py-1 w-full"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWaiver;


