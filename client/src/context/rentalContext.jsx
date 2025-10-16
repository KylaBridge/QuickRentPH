import React, { createContext, useContext } from "react";
import api from "../axios";

const RentalContext = createContext(null);

export const RentalProvider = ({ children }) => {
  const createRental = async (data) => {
    // data is expected to be a FormData instance
    const resp = await api.post("/api/rentals", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return resp.data;
  };

  const getUserRentals = async () => {
    const resp = await api.get("/api/rentals");
    return resp.data;
  };

  const getOwnerRentals = async () => {
    const resp = await api.get("/api/rentals/owner");
    return resp.data;
  };

  const getRental = async (id) => {
    const resp = await api.get(`/api/rentals/${id}`);
    return resp.data;
  };

  const cancelRental = async (id) => {
    const resp = await api.patch(`/api/rentals/${id}/cancel`);
    return resp.data;
  };

  const deleteRental = async (id) => {
    const resp = await api.delete(`/api/rentals/${id}`);
    return resp.data;
  };

  const updateRentalStatus = async (id, status, reason = null) => {
    const resp = await api.patch(`/api/rentals/${id}/status`, {
      status,
      reason,
    });
    return resp.data;
  };

  return (
    <RentalContext.Provider
      value={{
        createRental,
        getUserRentals,
        getOwnerRentals,
        getRental,
        cancelRental,
        deleteRental,
        updateRentalStatus,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};

export const useRental = () => useContext(RentalContext);

export default RentalContext;
