"use client";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import useSuccessNotification from "../custom-hooks/useSuccessNotification";
import {
  useDeleteCustomerMutation,
  useGetCustomerListQuery,
} from "../redux/features/customerSlice";
import { dashboardApi } from "../redux/features/dashboardSlice";
import { transactionApi } from "../redux/features/transactionSlice";
import Loader from "./Loader";

const Pagination = dynamic(() => import("./Pagination"));

const NoParty = dynamic(() => import("./NoParty"));
const PartyModal = dynamic(() => import("./PartyModal"));
// import NoParty from "./NoParty";
//import PartyModal from "./PartyModal";

const Customer = () => {
  const pathname = usePathname();
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const customerList = useSelector(
    (state) => state?.customer?.customerList || []
  );
  console.log("kjhgfghjkgfghjkl", customerList);
  const containerRef = useRef(null);

  const dispatch = useDispatch();

  const router = useRouter();
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isSuccess: isGetCustomerSuccess,
    isLoading: isGetCustomerLoading,
    isError: isGetCustomerError,
    error: getCustomerError,
    data: getCustomerData,
    isFetching,
  } = useGetCustomerListQuery(
    {
      businessId: businessIdSelected,
      searchQuery: debouncedInputValue,
      page: page,
    },
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
  useErrorNotification(getCustomerError, isGetCustomerError);
  useErrorNotification(deleteCustomerError, isDeleteCustomerError);
  useSuccessNotification(
    "Customer deleted successfully",
    null,
    isDeleteCustomerSuccess
  );

  useEffect(() => {
    if (isDeleteCustomerSuccess) {
      dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
      router.push("/dashboard/customers", { scroll: false });
    }
  }, [isDeleteCustomerSuccess]);

  useEffect(() => {
    if (businessIdSelected) {
      setSearchQuery("");
    }
  }, [businessIdSelected]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputValue(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, 500]);

  return (
    <div
      className="shadow-lg  container m-3 w-1/2 rounded-lg p-4 border overflow-auto hover:overflow-scroll"
      style={{ height: 600 }}
      ref={containerRef}
    >
      {isDeleteCustomerLoading ? <Loader /> : null}
      <PartyModal isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="space-y-4">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-2xl font-bold mb-4 md:mb-0">Customer List</div>

          <button
            disabled={!isGetCustomerSuccess}
            onClick={() => {
              setIsOpen({
                ...isOpen,
                status: true,
                type: "add",
              });
            }}
            className="ml-4 flex items-center text-blue-500 hover:text-blue-700 max-w-max"
          >
            <PlusCircleIcon className="w-6 h-6 mr-1" />
            <span>Add Customer</span>
          </button>
        </div>
        {getCustomerData?.data?.length > 0 ||
        (getCustomerData?.data?.length == 0 && debouncedInputValue !== "") ? (
          <div className="relative">
            <input
              type="text"
              placeholder="Search.."
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 w-full"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            </span>
          </div>
        ) : null}
        {getCustomerData?.data?.length == 0 && debouncedInputValue !== "" ? (
          <p>No customers found matching your search.</p>
        ) : null}
        {isGetCustomerLoading ? (
          <p>Loading...</p>
        ) : isGetCustomerError ? (
          <p>
            Error fetching customers:{" "}
            {getCustomerError?.error?.substring(0, 50)}
          </p>
        ) : (
          <>
            {isFetching ? (
              <div className="relative bg-red-300 w-full h-full">
                <Loader
                  wrapperStyle={{
                    position: "absolute",
                    alignItems: "flex-start",
                  }}
                />
              </div>
            ) : null}

            {getCustomerData?.data?.map((item, index) => (
              <Link
                key={index}
                className={`block p-4 border rounded-md shadow-md hover:shadow-lg transition duration-300 ease-in-out ${
                  pathname.includes(item._id)
                    ? "text-blue-500 bg-blue-100 font-semibold"
                    : "text-black hover:text-blue-500 font-normal"
                }`}
                href={`/dashboard/customers/${item?._id}`}
                scroll={false}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
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
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
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
            <Pagination
              totalPages={getCustomerData?.totalPages}
              currentPage={page}
              setPage={setPage}
            />
            {getCustomerData?.data.length == 0 &&
              isGetCustomerSuccess == true &&
              debouncedInputValue === "" && (
                // <Suspense fallback={<p>98765loading...</p>}>
                <NoParty title={"Add customer and maintain your daily khata"} />
                // </Suspense>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default Customer;
