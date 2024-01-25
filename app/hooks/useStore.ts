import { useContext } from "react";
import { GlobalStoreContext } from "../providers/store";

const useStore = () => {
  const { userType, setUserType } = useContext(GlobalStoreContext);
  return { userType, setUserType };
};
export default useStore;
