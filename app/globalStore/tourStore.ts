import { create } from "zustand";

type TourStore = {
  tour_id: number | null;
  setTourDetail: (tour_id: number) => void;
};

const useTourStore = create<TourStore>((set) => ({
  tour_id: null,
  setTourDetail: (detail) => set({ tour_id: detail }),
}));

export default useTourStore;
