import React, { Dispatch, SetStateAction } from "react";

export type userType = "Tourist" | "Guide" | undefined;

export type storeType = {
  userType: userType;
  setUserType: Dispatch<SetStateAction<"Tourist" | "Guide" | undefined>>;
};

export const GlobalStoreContext = React.createContext({
  userType: undefined,
  setUserType: (type: userType) => {},
} as storeType);
