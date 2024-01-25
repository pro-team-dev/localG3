import { User } from "../_layout";
import { Dispatch, SetStateAction, createContext } from "react";

export const AuthContext = createContext({
  user: undefined,
  setUser: (user: User | undefined) => {},
} as { user: User | undefined; setUser: Dispatch<SetStateAction<User | undefined>> });
