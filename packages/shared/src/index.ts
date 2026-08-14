export const APP_NAME = "RideWithMe";

export type ListingType = "buy" | "rent" | "lease" | "auction";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  listingType: ListingType;
  mileage: number;
  imageUrl: string;
  location: string;
}

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 12000,
    listingType: "buy",
    mileage: 18000,
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600",
    location: "Lagos",
  },
  {
    id: "2",
    make: "Honda",
    model: "CR-V",
    year: 2021,
    price: 450,
    listingType: "rent",
    mileage: 25000,
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600",
    location: "Abuja",
  },
  {
    id: "3",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2023,
    price: 850,
    listingType: "lease",
    mileage: 5000,
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600",
    location: "Lagos",
  },
  {
    id: "4",
    make: "Ford",
    model: "Mustang",
    year: 2020,
    price: 22000,
    listingType: "auction",
    mileage: 32000,
    imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=600",
    location: "Port Harcourt",
  },
];

export interface VehicleFilters {
  listingType?: ListingType;
  query?: string;
  maxPrice?: number;
}

export function filterVehicles(vehicles: Vehicle[], filters: VehicleFilters): Vehicle[] {
  return vehicles.filter((v) => {
    if (filters.listingType && v.listingType !== filters.listingType) return false;
    if (filters.maxPrice && v.price > filters.maxPrice) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${v.make} ${v.model} ${v.year}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function formatPrice(price: number, listingType: ListingType): string {
  const amount = `$${price.toLocaleString()}`;
  if (listingType === "rent") return `${amount}/day`;
  if (listingType === "lease") return `${amount}/mo`;
  return amount;
}

export function getVehicleById(vehicles: Vehicle[], id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}
