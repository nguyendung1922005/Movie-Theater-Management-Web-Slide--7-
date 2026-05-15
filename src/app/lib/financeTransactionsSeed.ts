/**
 * Shared seed transactions for FinanceTransactions + accounting snack totals.
 */

export type TxnStatus = "completed" | "refunded" | "pending" | "failed";
export type PayMethod = "Visa" | "Mastercard" | "Momo" | "ZaloPay" | "Cash";

export interface Transaction {
  id: string;
  ticketId: string;
  invoiceNo: string;
  customer: string;
  email: string;
  phone: string;
  movie: string;
  hall: string;
  showtime: string;
  date: string;
  displayDate: string;
  seats: string[];
  tickets: number;
  combos: number;
  ticketAmt: number;
  comboAmt: number;
  gross: number;
  method: PayMethod;
  status: TxnStatus;
  authCode: string;
}

export const TXN_DATA: Transaction[] = [
  { id:"TXN-A4F2E891", ticketId:"TKT260508-00892", invoiceNo:"INV-2026-04892", customer:"Nguyen Thi Anh",   email:"anh.nt@gmail.com",    phone:"090 123 4567", movie:"Your Name",    hall:"IMAX",        showtime:"14:00", date:"2026-05-08", displayDate:"May 8, 2026",  seats:["A1","A2"],          tickets:2, combos:3, ticketAmt:360_000, comboAmt:267_000, gross:627_000, method:"Momo",       status:"completed", authCode:"MOM8192C" },
  { id:"TXN-B3C7D245", ticketId:"TKT260508-00891", invoiceNo:"INV-2026-04891", customer:"Tran Minh Khoa",   email:"khoa.tm@email.com",   phone:"098 765 4321", movie:"Neon Horizon", hall:"Hall 1",      showtime:"13:30", date:"2026-05-08", displayDate:"May 8, 2026",  seats:["C5"],               tickets:1, combos:1, ticketAmt:90_000,  comboAmt:89_000,  gross:179_000, method:"Visa",       status:"completed", authCode:"VSA44F2" },
  { id:"TXN-F9A1E320", ticketId:"TKT260508-00890", invoiceNo:"INV-2026-04890", customer:"Le Quoc Hung",     email:"hung.lq@yahoo.com",   phone:"093 456 7890", movie:"Code Black",   hall:"Dolby Atmos", showtime:"16:00", date:"2026-05-08", displayDate:"May 8, 2026",  seats:["F3","F4"],          tickets:2, combos:4, ticketAmt:300_000, comboAmt:356_000, gross:656_000, method:"ZaloPay",    status:"completed", authCode:"ZLP9F3A" },
  { id:"TXN-C2B8F671", ticketId:"TKT260508-00889", invoiceNo:"INV-2026-04889", customer:"Pham Thi Lan",     email:"lan.pt@outlook.com",  phone:"091 234 5678", movie:"Your Name",    hall:"IMAX",        showtime:"14:00", date:"2026-05-08", displayDate:"May 8, 2026",  seats:["B8","B9","B10"],    tickets:3, combos:2, ticketAmt:540_000, comboAmt:178_000, gross:718_000, method:"Visa",       status:"completed", authCode:"VSA77C2" },
  { id:"TXN-E5D4A983", ticketId:"TKT260508-00888", invoiceNo:"INV-2026-04888", customer:"Vo Hoang Dung",    email:"dung.vh@gmail.com",   phone:"096 987 6543", movie:"Iron Legacy",  hall:"Hall 3",      showtime:"19:00", date:"2026-05-08", displayDate:"May 8, 2026",  seats:["D2","D3"],          tickets:2, combos:1, ticketAmt:220_000, comboAmt:89_000,  gross:309_000, method:"Cash",       status:"completed", authCode:"CASH001" },
  { id:"TXN-G7F6B104", ticketId:"TKT260508-00887", invoiceNo:"INV-2026-04887", customer:"Hoang Thu Minh",   email:"minh.ht@gmail.com",   phone:"097 654 3210", movie:"Dark Hollow",  hall:"Hall 2",      showtime:"21:30", date:"2026-05-08", displayDate:"May 8, 2026",  seats:["E6"],               tickets:1, combos:0, ticketAmt:90_000,  comboAmt:0,       gross:90_000,  method:"Momo",       status:"refunded",  authCode:"REF0887" },
  { id:"TXN-H8C9A215", ticketId:"TKT260508-00886", invoiceNo:"INV-2026-04886", customer:"Dang Khai Nam",    email:"nam.dk@email.com",    phone:"090 111 2233", movie:"Void Runner",  hall:"IMAX",        showtime:"10:00", date:"2026-05-08", displayDate:"May 8, 2026",  seats:["A5","A6","A7"],     tickets:3, combos:5, ticketAmt:540_000, comboAmt:445_000, gross:985_000, method:"Visa",       status:"completed", authCode:"VSA55H8" },
  { id:"TXN-I1B0D326", ticketId:"TKT260508-00885", invoiceNo:"INV-2026-04885", customer:"Bui Thi Thu",      email:"thu.bt@gmail.com",    phone:"093 222 3344", movie:"Neon Horizon", hall:"Hall 1",      showtime:"21:30", date:"2026-05-08", displayDate:"May 8, 2026",  seats:["G1","G2"],          tickets:2, combos:2, ticketAmt:180_000, comboAmt:178_000, gross:358_000, method:"ZaloPay",    status:"completed", authCode:"ZLP4I1B" },
  { id:"TXN-J2A3E437", ticketId:"TKT260508-00884", invoiceNo:"INV-2026-04884", customer:"Nguyen Van Long",  email:"long.nv@yahoo.com",   phone:"091 333 4455", movie:"Code Black",   hall:"Dolby Atmos", showtime:"13:30", date:"2026-05-08", displayDate:"May 8, 2026",  seats:["H9"],               tickets:1, combos:1, ticketAmt:150_000, comboAmt:89_000,  gross:239_000, method:"Cash",       status:"pending",   authCode:"PEND001" },
  { id:"TXN-K4D5F548", ticketId:"TKT260508-00883", invoiceNo:"INV-2026-04883", customer:"Ly Thi Hoa",       email:"hoa.lt@email.com",    phone:"096 444 5566", movie:"Your Name",    hall:"IMAX",        showtime:"19:00", date:"2026-05-08", displayDate:"May 8, 2026",  seats:["B1","B2","B3","B4"],tickets:4, combos:6, ticketAmt:720_000, comboAmt:534_000, gross:1_254_000, method:"Mastercard", status:"completed", authCode:"MCA88K4" },
  { id:"TXN-L5E6G659", ticketId:"TKT260507-00880", invoiceNo:"INV-2026-04880", customer:"Tran Van Binh",    email:"binh.tv@gmail.com",   phone:"098 555 6677", movie:"Iron Legacy",  hall:"Dolby Atmos", showtime:"16:00", date:"2026-05-07", displayDate:"May 7, 2026",  seats:["C8","C9"],          tickets:2, combos:2, ticketAmt:300_000, comboAmt:178_000, gross:478_000, method:"Visa",       status:"completed", authCode:"VSA33L5" },
  { id:"TXN-M6F7H760", ticketId:"TKT260507-00879", invoiceNo:"INV-2026-04879", customer:"Phan Thi Ngoc",    email:"ngoc.pt@outlook.com", phone:"090 666 7788", movie:"Void Runner",  hall:"Hall 3",      showtime:"19:00", date:"2026-05-07", displayDate:"May 7, 2026",  seats:["D7"],               tickets:1, combos:1, ticketAmt:110_000, comboAmt:89_000,  gross:199_000, method:"Momo",       status:"completed", authCode:"MOM2M6F" },
  { id:"TXN-N7G8I871", ticketId:"TKT260507-00878", invoiceNo:"INV-2026-04878", customer:"Do Minh Tuan",     email:"tuan.dm@gmail.com",   phone:"093 777 8899", movie:"Neon Horizon", hall:"IMAX",        showtime:"21:30", date:"2026-05-07", displayDate:"May 7, 2026",  seats:["E10","E11"],        tickets:2, combos:3, ticketAmt:360_000, comboAmt:267_000, gross:627_000, method:"ZaloPay",    status:"completed", authCode:"ZLP7N7G" },
  { id:"TXN-O8H9J982", ticketId:"TKT260506-00871", invoiceNo:"INV-2026-04871", customer:"Huynh Thi Mai",    email:"mai.ht@yahoo.com",    phone:"091 888 9900", movie:"Dark Hollow",  hall:"Hall 1",      showtime:"10:00", date:"2026-05-06", displayDate:"May 6, 2026",  seats:["A3","A4"],          tickets:2, combos:1, ticketAmt:180_000, comboAmt:89_000,  gross:269_000, method:"Cash",       status:"completed", authCode:"CASH002" },
  { id:"TXN-P9I0K093", ticketId:"TKT260506-00870", invoiceNo:"INV-2026-04870", customer:"Vo Thi Xuan",      email:"xuan.vt@gmail.com",   phone:"096 999 0011", movie:"Code Black",   hall:"Hall 2",      showtime:"13:30", date:"2026-05-06", displayDate:"May 6, 2026",  seats:["F9"],               tickets:1, combos:2, ticketAmt:90_000,  comboAmt:178_000, gross:268_000, method:"Visa",       status:"failed",    authCode:"FAIL001" },
];
