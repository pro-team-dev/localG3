// Define the data types
interface Tourist {
  touristName: string;
  touristPic: string; // Assuming this is a URL to the tourist's picture
}

interface TourDetail {
  tourName: string;
  location: string;
  duration: number; // in days
}

export interface Offer {
  tourist: Tourist;
  price: number;
  status: "accepted" | "not accepted";
  tourDetail: TourDetail;
}

// Create dummy data for the Offers page
const dummyOffers: Offer[] = [
  {
    tourist: {
      touristName: "John Doe",
      touristPic: "https://i.pravatar.cc/300",
    },
    price: 100,
    status: "accepted",
    tourDetail: {
      tourName: "City Exploration",
      location: "New York City",
      duration: 3,
    },
  },
  {
    tourist: {
      touristName: "Jane Smith",
      touristPic: "https://i.pravatar.cc/400",
    },
    price: 150,
    status: "not accepted",
    tourDetail: {
      tourName: "Mountain Adventure",
      location: "Rocky Mountains",
      duration: 5,
    },
  },
  // Add more dummy offers as needed
];

export default dummyOffers;
