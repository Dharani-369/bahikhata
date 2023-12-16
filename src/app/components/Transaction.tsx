"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { customerApi } from "../redux/features/customerSlice";
import {
  useDeleteTransactionMutation,
  useGetTransactionListQuery,
} from "../redux/features/transactionSlice";

//import Sidebar from "./Sidebar";
import dynamic from "next/dynamic";
const Sidebar = dynamic(() => import("./Sidebar"));
import { usePathname } from "next/navigation";
import { supplierApi } from "../redux/features/supplierSlice";

import useErrorNotification from "../custom-hooks/useErrorNotification";
import useSuccessNotification from "../custom-hooks/useSuccessNotification";

import { dashboardApi } from "../redux/features/dashboardSlice";

const Transaction = ({ partyId }) => {
  let [isOpen, setIsOpen] = useState({ status: false, type: "", value: null });
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const {
    isSuccess: isGetTransactionSuccess,
    isLoading: isGetTransactionLoading,
    isError: isGetTransactionError,
    error: getTransactionError,
    data: getTransactionData,
  } = useGetTransactionListQuery(
    {
      businessId: businessIdSelected,
      partyId: partyId,
      page: page,
    },
    { skip: !businessIdSelected || !partyId }
  );
  const [
    deleteTransaction,
    {
      isSuccess: isDeleteTransactionSuccess,
      isLoading: isDeleteTransactionLoading,
      isError: isDeleteTransactionError,
      error: deleteTransactionError,
      data: deleteTransactionData,
    },
  ] = useDeleteTransactionMutation();
  useErrorNotification(getTransactionError, isGetTransactionError);
  useErrorNotification(deleteTransactionError, isDeleteTransactionError);
  useSuccessNotification(
    "Transaction deleted successfully",
    null,
    isDeleteTransactionSuccess
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  console.log("kjhghjk3333", getTransactionData);
  useEffect(() => {
    if (isDeleteTransactionSuccess) {
      if (pathname.includes("customer")) {
        dispatch(customerApi.util.invalidateTags(["customer"]));
        dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
      } else {
        dispatch(supplierApi.util.invalidateTags(["supplier"]));
        dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
      }
    }
  }, [isDeleteTransactionSuccess]);
  return (
    <Sidebar
      isDeleteTransactionLoading={isDeleteTransactionLoading}
      partyId={partyId}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isGetTransactionLoading={isGetTransactionLoading}
      deleteTransaction={deleteTransaction}
      getTransactionData={getTransactionData}
      businessIdSelected={businessIdSelected}
      isGetTransactionError={isGetTransactionError}
      getTransactionError={getTransactionError}
      showSidebar={showSidebar}
      toggleSidebar={toggleSidebar}
      page={page}
      setPage={setPage}
    />
  );
};

export default Transaction;
