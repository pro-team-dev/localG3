import { create } from "zustand";
import { locationType } from "../(home)/book";

interface LocationStoreState {
  locations: locationType[];
  addLocation: (location: locationType) => void;
  removeLocation: (id: number) => void;
  count: number;
  removeLocationUsingLatAndLng: (lat: number, lng: number) => void;
}

export const useLocationStore = create<LocationStoreState>((set) => ({
  locations: [],
  addLocation: (location) =>
    set((state) => ({
      locations: [...state.locations, location],
      count: state.count + 1, // Increase count when a location is added
    })),
  removeLocation: (id) =>
    set((state) => ({
      locations: state.locations.filter((loc) => loc.id !== id),
      count: state.count - 1, // Decrease count when a location is removed
    })),
  removeLocationUsingLatAndLng: (lat: number, lng: number) =>
    set((state) => ({
      locations: state.locations.filter(
        (loc) => loc.lat !== lat || loc.lng !== lng
      ),
      count: state.count - 1,
    })),
  get count() {
    return this.locations.length;
  },
}));
