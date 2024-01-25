import { create } from "zustand";

type UserDataType = {
  username: string;
  email: string;
  password: string;
  fullname: string;
  lastname: string;
  profilePic: string;
  citizenShipNo: string;
};

interface RegisterUserType extends UserDataType {
  setInitialData: (username: string, password: string, email: string) => void;
  setImage: (pp: string) => void;
}

export const useRegisterUser = create<RegisterUserType>((set) => ({
  username: "",
  email: "",
  password: "",
  fullname: "",
  lastname: "",
  profilePic: "",
  citizenShipNo: "",
  setInitialData: (username: string, password: string, email: string) =>
    set((state) => ({ username, password, email })),
  setImage: (pp: string) => set({ profilePic: pp }),
}));

type userImageType = {
  coverImage: string;
  setCoverImage: (pp: string) => void;
  profilePic: string;
  setProfilePic: (pp: string) => void;
};

export const useUserImage = create<userImageType>((set) => ({
  coverImage: "",
  setCoverImage: (pp: string) => set({ coverImage: pp }),
  profilePic: "",
  setProfilePic: (pp: string) => set({ profilePic: pp }),
}));

// make jwt store
export const useJwtToken = create<{
  jwtToken: string | null;
  setJwtToken: (jwtToken: string | null) => void;
}>((set) => ({
  jwtToken: "",
  setJwtToken: (jwtToken: string | null) => set({ jwtToken }),
}));
