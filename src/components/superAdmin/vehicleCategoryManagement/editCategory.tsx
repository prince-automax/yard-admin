"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormFieldInput, TextArea } from "../../ui/fromFields";
import { formStyle } from "../../ui/style";

import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/app/(home)/(superAdmin)/loading";

type Inputs = {
  name: string;
  description: string;
};

const ViewVehicleCategory = ({ categoryId }) => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Initially set to true to show loading spinner

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Inputs>();
  const router = useRouter();

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

  const FetchVehicleCategory = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/vehicle/cat/${categoryId?.categoryId}`);
      console.log("RESPONSE FOR INDIVIDUAL VEHCAT", response);
      setCategoryData(response?.data?.vehicleCategory);
      reset(response?.data?.vehicleCategory);
    
    } catch (error) {
      console.log("error", error);
      // toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FetchVehicleCategory();
  }, []);

  const EditVehilceCategory = async (data: Inputs) => {
    setIsLoading(true);
    console.log("Data on submit", data);

    try {
      const modifiedData = {
        name: data?.name.toUpperCase(),
        description: data?.description,
      };

      const response = await axiosInstance.put(
        `/vehicle/cat/edit/${categoryId?.categoryId}`,
        modifiedData
      );
      setSuccess({
        text: response?.data?.message,
      });
      router.push("/vehicleCategoryManagement");
      window.onclose
    } catch (error) {
      console.error("Error:", error.response);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center border-2 h-full w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center border-2 h-full w-full">
      <form
        className={`${formStyle.data}`}
        onSubmit={handleSubmit(EditVehilceCategory)}
      >
        <div className="w-full text-center uppercase font-bold">
          <h1>Edit Vehicle Category</h1>
        </div>

        <FormFieldInput
          label=""
          type="text"
          name="name"
          register={register}
          error={errors.name}
          defaultValue={categoryData?.name}
          required
          placeholder="Enter Category Name"
        />
        <TextArea
          label=""
          type="text"
          name="description"
          register={register}
          error={errors.description}
          defaultValue={categoryData?.description}
          placeholder=" Enter Description"
        />

        <div className="w-full">
          <button
            type="submit"
            className="bg-[#333333] text-white px-4 py-1 w-full"
          >
            Edit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewVehicleCategory;
