/** Distributor share applied to ticket sales (finance dashboard) */
export const DISTRIBUTOR_FEE_RATE = 0.5;

/** Estimated COGS as share of snack / combo revenue */
export const SNACK_COGS_RATE = 0.3;

export type SnackItem = {
  id: string;
  name: string;
  size: string;
  emoji: string;
  price: number;
};

export const SNACK_ITEMS: SnackItem[] = [
  { id: "pc-l", name: "Popcorn", size: "Large", emoji: "🍿", price: 65000 },
  { id: "pp-l", name: "Pepsi", size: "Large", emoji: "🥤", price: 35000 },
  { id: "cb-1", name: "Combo Set 1", size: "M Popcorn + M Pepsi", emoji: "🎬", price: 80000 },
  { id: "nc", name: "Nachos", size: "Regular", emoji: "🧀", price: 55000 },
  { id: "hd", name: "Hot Dog", size: "Classic", emoji: "🌭", price: 50000 },
  { id: "cs", name: "Choco Sticks", size: "Pack", emoji: "🍫", price: 45000 },
];

export type VoucherType = "percent" | "flat";

export type Voucher = {
  code: string;
  type: VoucherType;
  value: number; // percent (0-100) or flat amount (VND)
  expiry: string; // ISO-ish display string
  active: boolean;
};

export const VOUCHERS: Voucher[] = [
  { code: "CINEMA20", type: "percent", value: 20, expiry: "2026-12-31", active: true },
  { code: "WELCOME50K", type: "flat", value: 50000, expiry: "2026-09-30", active: true },
  { code: "MIDWEEK10", type: "percent", value: 10, expiry: "2026-06-30", active: true },
];

export function normalizeVoucherCode(code: string) {
  return code.trim().toUpperCase();
}

export function findVoucherByCode(code: string) {
  const c = normalizeVoucherCode(code);
  return VOUCHERS.find((v) => v.active && v.code === c) ?? null;
}

