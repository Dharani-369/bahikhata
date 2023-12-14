"use client";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteCustomerMutation,
  useGetCustomerListQuery,
} from "../redux/features/customerSlice";
import { transactionApi } from "../redux/features/transactionSlice";
import Loader from "./Loader";
import NoParty from "./NoParty";
import PartyModal from "./PartyModal";

const Customer = () => {
  const pathname = usePathname();
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    isSuccess: isGetCustomerSuccess,
    isLoading: isGetCustomerLoading,
    isError: isGetCustomerError,
    error: getCustomerError,
    data: getCustomerData,
    isFetching,
  } = useGetCustomerListQuery(
    { businessId: businessIdSelected },
    { skip: !businessIdSelected }
  );
  const [
    deleteCustomer,
    {
      isSuccess: isDeleteCustomerSuccess,
      isLoading: isDeleteCustomerLoading,
      isError: isDeleteCustomerError,
      error: deleteCustomerError,
      data: deleteCustomerData,
    },
  ] = useDeleteCustomerMutation();
  let [isOpen, setIsOpen] = useState({
    status: false,
    type: "",
    value: null,
    part: "customer",
  });
  useEffect(() => {
    if (isDeleteCustomerSuccess) {
      dispatch(transactionApi.util.invalidateTags(["transaction"]));
      router.push("/dashboard/customers");
    }
  }, [isDeleteCustomerSuccess]);
  return (
    <div className="container mx-auto p-6 w-1/2">
      {isDeleteCustomerLoading ? <Loader /> : null}
      <PartyModal isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="space-y-4">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-2xl font-bold mb-4 md:mb-0">Customer List</div>

          <button
            onClick={() => {
              setIsOpen({
                ...isOpen,
                status: true,
                type: "add",
              });
            }}
            className="ml-4 flex items-center text-blue-500 hover:text-blue-700"
          >
            <PlusCircleIcon className="w-6 h-6 mr-1" />
            <span>Add Customer</span>
          </button>
        </div>
        {isGetCustomerLoading ? (
          <p>Loading...</p>
        ) : isGetCustomerError ? (
          <p>Error fetching customers: {getCustomerError?.message}</p>
        ) : (
          <>
            {getCustomerData?.data?.map((item, index) => (
              <Link
                key={index}
                className={`block p-4 border rounded-md shadow-md hover:shadow-lg transition duration-300 ease-in-out ${
                  pathname.includes(item._id)
                    ? "text-blue-500 bg-blue-100 font-semibold"
                    : "text-black hover:text-blue-500 font-normal"
                }`}
                href={`/dashboard/customers/${item?._id}`}
              >
                <div className="flex flex-col sm:flex-row justify-between ">
                  <span>{item?.name}</span>
                  <div className="flex flex-col items-end">
                    <div>
                      {item.balance > 0
                        ? "You will give"
                        : item.balance < 0
                        ? "You will get"
                        : ""}{" "}
                    </div>
                    <div
                      className={`ml-2 ${
                        item.balance > 0
                          ? "text-green-500"
                          : item.balance < 0
                          ? "text-red-500"
                          : ""
                      }`}
                    >
                      ₹{Math.abs(item.balance)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row">
                  <PencilSquareIcon
                    onClick={() => {
                      setIsOpen({
                        ...isOpen,
                        status: true,
                        type: "edit",
                        value: item,
                      });
                    }}
                    className="w-5 h-5 text-gray-500 hover:text-cyan-500 cursor-pointer mr-2"
                  ></PencilSquareIcon>

                  <TrashIcon
                    onClick={() => {
                      deleteCustomer(
                        JSON.stringify({
                          businessId: businessIdSelected,
                          customerId: item?._id,
                        })
                      );
                    }}
                    className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
                  />
                </div>
              </Link>
            ))}
            {getCustomerData?.data.length == 0 &&
              isGetCustomerSuccess == true && (
                <NoParty title={"Add customer and maintain your daily khata"} />
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default Customer;
