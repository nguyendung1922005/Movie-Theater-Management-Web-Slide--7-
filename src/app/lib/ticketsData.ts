import { supabase } from '../../lib/supabaseClient';

export type Status = "upcoming" | "past" | "cancelled";

export interface TicketRecord {
  id: string;
  movie: string;
  genre: string;
  poster: string;
  date: string;
  shortDate: string;
  time: string;
  hall: string;
  seats: string[];
  format: string;
  price: number;
  status: Status;
  bookingRef: string;
  cinema: string;
  accentColor: string;
  rating?: number;
  comment?: string;
  /** Counter POS accounting — optional on catalog rows */
  posPayMethod?: "cash" | "card" | "bank_qr";
  posTicketRevenue?: number;
  posSnackRevenue?: number;
}

export const TICKETS: TicketRecord[] = [
  {
    id: "TK-001",
    movie: "Your Name",
    genre: "Animation · Romance",
    poster:
      "https://images.unsplash.com/photo-1561046582-8f3224fcdab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VyJTIwbmFtZSUyMGFuaW1lJTIwa2ltaSUyMG5vJTIwbmElMjB3YSUyMGNvbWV0JTIwc2t5fGVufDF8fHx8MTc3MjU1MzcwMnww&ixlib=rb-4.1.0&q=80&w=400",
    date: "Saturday, May 17, 2026",
    shortDate: "May 17, 2026",
    time: "7:30 PM",
    hall: "IMAX 03",
    seats: ["G10", "G11"],
    format: "IMAX",
    price: 280_000,
    status: "upcoming",
    bookingRef: "TH-ABC1234",
    cinema: "CGV Vincom Center",
    accentColor: "#6366f1",
  },
  {
    id: "TK-002",
    movie: "Neon Horizon",
    genre: "Sci-Fi · Action",
    poster:
      "https://images.unsplash.com/photo-1728457848586-fc2c468b4689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBuZW9uJTIwY2l0eSUyMGZ1dHVyaXN0aWMlMjBkYXJrJTIwYmx1ZXxlbnwxfHx8fDE3NzI2NzA5MjB8MA&ixlib=rb-4.1.0&q=80&w=400",
    date: "Sunday, May 18, 2026",
    shortDate: "May 18, 2026",
    time: "9:15 PM",
    hall: "4DX Hall 01",
    seats: ["H8"],
    format: "4DX",
    price: 220_000,
    status: "upcoming",
    bookingRef: "TH-DEF5678",
    cinema: "CGV Vincom Center",
    accentColor: "#3b82f6",
  },
  {
    id: "TK-003",
    movie: "Void Runner",
    genre: "Sci-Fi · Adventure",
    poster:
      "https://images.unsplash.com/photo-1597366812780-bc0f837f6ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGdhbGF4eSUyMHN0YXJzJTIwbmVidWxhJTIwY2luZW1hdGljfGVufDF8fHx8MTc3MjY3MDkyMHww&ixlib=rb-4.1.0&q=80&w=400",
    date: "Saturday, May 3, 2026",
    shortDate: "May 3, 2026",
    time: "8:00 PM",
    hall: "Hall 05 · Dolby",
    seats: ["F6", "F7", "F8"],
    format: "Dolby",
    price: 195_000,
    status: "past",
    bookingRef: "TH-GHI9012",
    cinema: "BHD Star Landmark 81",
    accentColor: "#8b5cf6",
    rating: 4,
    comment: "Clean hall, immersive sound. Would watch again.",
  },
  {
    id: "TK-004",
    movie: "Iron Legacy",
    genre: "Fantasy · Action",
    poster:
      "https://images.unsplash.com/photo-1668007470566-bd1e18d05fe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJyaW9yJTIwc3dvcmQlMjBlcGljJTIwZmFudGFzeSUyMGJhdHRsZSUyMGRhcmt8ZW58MXx8fHwxNzcyNjcwOTIwfDA&ixlib=rb-4.1.0&q=80&w=400",
    date: "Friday, April 25, 2026",
    shortDate: "Apr 25, 2026",
    time: "6:45 PM",
    hall: "IMAX 01",
    seats: ["E12"],
    format: "IMAX",
    price: 280_000,
    status: "past",
    bookingRef: "TH-JKL3456",
    cinema: "CGV Vincom Center",
    accentColor: "#f97316",
    rating: 5,
    comment: "Projection was crisp and seats were comfortable.",
  },
  {
    id: "TK-005",
    movie: "Dark Hollow",
    genre: "Horror · Thriller",
    poster:
      "https://images.unsplash.com/photo-1768121496378-0644c37e7fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBhYmFuZG9uZWQlMjBkYXJrJTIwYnVpbGRpbmclMjBuaWdodCUyMGZvZ3xlbnwxfHx8fDE3NzI2NzA5MjF8MA&ixlib=rb-4.1.0&q=80&w=400",
    date: "Tuesday, April 15, 2026",
    shortDate: "Apr 15, 2026",
    time: "10:00 PM",
    hall: "Hall 06",
    seats: ["D9", "D10"],
    format: "2D",
    price: 130_000,
    status: "cancelled",
    bookingRef: "TH-MNO7890",
    cinema: "Lotte Cinema Landmark",
    accentColor: "#e8192c",
  },
];

/** Supabase: offline POS tickets (StaffPOS) validated by StaffScanner */
export const TABLE_POS_ISSUED = "bookings";
/** Supabase: seat ids sold offline per show fingerprint */
export const TABLE_POS_SOLD_SEATS = "sold_seats";

export function showFingerprint(movie: string, date: string, time: string, hall: string) {
  return `${movie}|${date}|${time}|${hall}`;
}

export async function loadSoldSeatMap(): Promise<Record<string, string[]>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_POS_SOLD_SEATS)
      .select('fingerprint, seat_ids');
    
    if (error) throw error;
    
    const map: Record<string, string[]> = {};
    data?.forEach(item => {
      map[item.fingerprint] = item.seat_ids || [];
    });
    
    return map;
  } catch (error) {
    console.error('Error loading sold seat map:', error);
    return {};
  }
}

export async function appendSoldSeatsForShow(fp: string, seatIds: string[]): Promise<void> {
  if (seatIds.length === 0) return;
  
  try {
    const map = await loadSoldSeatMap();
    const set = new Set([...(map[fp] ?? []), ...seatIds]);
    
    const { error } = await supabase
      .from(TABLE_POS_SOLD_SEATS)
      .upsert({
        fingerprint: fp,
        seat_ids: [...set],
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'fingerprint'
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error appending sold seats:', error);
  }
}

export async function loadPosIssuedTickets(): Promise<TicketRecord[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE_POS_ISSUED)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    
    if (error) throw error;
    
    return data as TicketRecord[] || [];
  } catch (error) {
    console.error('Error loading POS issued tickets:', error);
    return [];
  }
}

export async function appendPosIssuedTicket(t: TicketRecord): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE_POS_ISSUED)
      .insert({
        ...t,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error appending POS issued ticket:', error);
  }
}

/** Same convention as MyTickets.tsx — scanner parses this payload */
export function buildCinemaQrPayload(bookingRef: string, seats: string[]) {
  const seatPart = seats.length > 0 ? seats.join(",") : "—";
  return `CINEMA:${bookingRef}:${seatPart}`;
}

export function parseCinemaQrPayload(raw: string): { bookingRef: string; seats: string[] } | null {
  const s = raw.trim();
  const m = /^CINEMA:([^:]+):(.*)$/i.exec(s);
  if (!m) return null;
  const bookingRef = m[1].trim();
  const rest = m[2].trim();
  const seats = rest && rest !== "—" ? rest.split(",").map((x) => x.trim()).filter(Boolean) : [];
  return { bookingRef, seats };
}

