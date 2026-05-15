/** Mirrors Checkout.tsx BOOKING shape for POS and shared kiosk flows */

export interface BookingSeat {
  id: string;
  tier: string;
  price: number;
  color: string;
}

export interface BookingFixture {
  movie: string;
  originalTitle: string;
  date: string;
  time: string;
  format: string;
  hall: string;
  theater: string;
  address: string;
  seats: BookingSeat[];
}

export const BOOKING: BookingFixture = {
  movie: "Your Name",
  originalTitle: "君の名は。",
  date: "Monday, March 2, 2026",
  time: "8:15 PM",
  format: "3D",
  hall: "Hall 3",
  theater: "CINEMA Hollywood",
  address: "123 Cinema Blvd, Hollywood, CA 90028",
  seats: [
    { id: "G10", tier: "Standard", price: 90000, color: "#4a90e2" },
    { id: "G11", tier: "Standard", price: 90000, color: "#4a90e2" },
    { id: "C5", tier: "Premium", price: 120000, color: "#7b2d8b" },
  ],
};
