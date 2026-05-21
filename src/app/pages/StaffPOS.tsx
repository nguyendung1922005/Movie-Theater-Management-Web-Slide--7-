/**
 * Counter POS — seats + concessions, offline payment modal, thermal ticket + scanner QR
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Minus, Receipt, Ticket, Layers, X, Wallet, CreditCard, Smartphone, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Toaster, toast } from "sonner";
import { StaffPage, SC } from "../components/StaffLayout";
import { StaffRouteGuard } from "../components/StaffRouteGuard";
import { BOOKING } from "../lib/bookingData";
import { SNACK_ITEMS } from "../lib/commerceData";
import {
  TICKETS,
  appendPosIssuedTicket,
  appendSoldSeatsForShow,
  buildCinemaQrPayload,
  showFingerprint,
  type TicketRecord,
} from "../lib/ticketsData";
import { formatDigitsAsCurrencyTyping } from "../lib/inputFormat";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + " ₫";
}

type PayMethod = "cash" | "card" | "bank_qr";

type ModalPhase = "closed" | "pay" | "thermal";

type SaleSnapshot = {
  bookingRef: string;
  seatLines: { id: string; tier: string; price: number }[];
  snackLines: { name: string; qty: number; unit: number; sub: number }[];
  total: number;
  payMethod: PayMethod;
  qrPayload: string;
};

function newBookingRef() {
  return `TH-POS-${Date.now().toString(36).toUpperCase().slice(-10)}`;
}

function BankingQrPlaceholder() {
  const cells = Array.from({ length: 11 * 11 }, (_, i) => i);
  return (
    <div
      className="mx-auto rounded-lg overflow-hidden border-4 border-black"
      style={{ width: 160, height: 160, background: "#fff" }}
      aria-hidden
    >
      <div className="grid grid-cols-11 w-full h-full">
        {cells.map((i) => {
          const r = Math.floor(i / 11);
          const c = i % 11;
          const edge = r === 0 || c === 0 || r === 10 || c === 10;
          const finder = (r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3);
          const on = edge || finder || (i * 17) % 23 < 10;
          return <div key={i} style={{ backgroundColor: on ? "#0a0a0f" : "#fff" }} />;
        })}
      </div>
    </div>
  );
}

export function StaffPOS() {
  // Dữ liệu suất chiếu và ghế thật từ Backend
  const [currentShowtime, setCurrentShowtime] = useState<any>(null);
  const [realtimeSeats, setRealtimeSeats] = useState<any[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const stRes = await fetch("http://localhost:3000/api/showtimes");
        const stData = await stRes.json();
        if (stData.length > 0) {
          const st = stData[0]; // Tạm thời lấy suất chiếu đầu tiên
          setCurrentShowtime(st);
          
          const seatRes = await fetch(`http://localhost:3000/api/showtimes/${st.id}/seats`);
          const seatData = await seatRes.json();
          if (seatData.success) {
            setRealtimeSeats(seatData.seats);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Lỗi lấy dữ liệu từ server!");
      } finally {
        setLoadingSeats(false);
      }
    };
    fetchRealData();
  }, []);

  // Mảng các ID ghế đang chọn
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [snackQty, setSnackQty] = useState<Record<string, number>>({});

  const [modalPhase, setModalPhase] = useState<ModalPhase>("closed");
  const [payMethod, setPayMethod] = useState<PayMethod | null>(null);
  const [sale, setSale] = useState<SaleSnapshot | null>(null);
  /** Cash tender (formatted) — optional UX when paying cash */
  const [cashTenderFormatted, setCashTenderFormatted] = useState("");

  const seatTotal = useMemo(
    () => {
      let total = 0;
      selectedSeatIds.forEach(id => {
        const seat = realtimeSeats.find(s => s.id === id);
        if (seat) {
          total += seat.type === "VIP" ? (currentShowtime?.priceBase || 80000) + 20000 : (currentShowtime?.priceBase || 80000);
        }
      });
      return total;
    },
    [selectedSeatIds, realtimeSeats, currentShowtime]
  );

  const snackTotal = useMemo(
    () => SNACK_ITEMS.reduce((acc, s) => acc + s.price * (snackQty[s.id] ?? 0), 0),
    [snackQty],
  );

  const grand = seatTotal + snackTotal;

  const openPaymentModal = useCallback(() => {
    if (grand <= 0) {
      toast.error("Add seats or concessions before checkout.");
      return;
    }
    setPayMethod(null);
    setCashTenderFormatted("");
    setModalPhase("pay");
  }, [grand]);

  function toggleSeat(seat: any) {
    if (seat.isBooked) return;
    setSelectedSeatIds((prev) => 
      prev.includes(seat.id) 
        ? prev.filter((id) => id !== seat.id) 
        : [...prev, seat.id]
    );
  }

  function setSnack(id: string, delta: number) {
    setSnackQty((prev) => {
      const n = Math.max(0, (prev[id] ?? 0) + delta);
      const next = { ...prev };
      if (n === 0) delete next[id];
      else next[id] = n;
      return next;
    });
  }

  function confirmPayment() {
    if (!payMethod) {
      toast.error("Choose a payment method.");
      return;
    }
    const seatLines = selectedSeatIds.map(id => {
      const seat = realtimeSeats.find(s => s.id === id);
      const price = seat.type === "VIP" ? (currentShowtime?.priceBase || 80000) + 20000 : (currentShowtime?.priceBase || 80000);
      return { id: `${seat.row}${seat.number}`, tier: seat.type, price };
    });
    
    const snackLines = SNACK_ITEMS.filter((s) => (snackQty[s.id] ?? 0) > 0).map((s) => ({
      name: s.name,
      qty: snackQty[s.id] ?? 0,
      unit: s.price,
      sub: s.price * (snackQty[s.id] ?? 0),
    }));
    const total =
      seatLines.reduce((a, l) => a + l.price, 0) + snackLines.reduce((a, l) => a + l.sub, 0);
    const bookingRef = newBookingRef();
    const seatIds = seatLines.map((l) => l.id);
    const qrPayload = buildCinemaQrPayload(bookingRef, seatIds);
    setSale({ bookingRef, seatLines, snackLines, total, payMethod, qrPayload });
    setModalPhase("thermal");
    toast.success("Payment confirmed", { description: "Review the thermal ticket, then print for the guest." });
  }

  function closeModal() {
    setModalPhase("closed");
    setPayMethod(null);
    setSale(null);
    setCashTenderFormatted("");
  }

  function finalizePrintedSale() {
    if (!sale) return;
    
    // Gọi API lưu xuống DB thật
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        showtimeId: currentShowtime.id,
        seatIds: selectedSeatIds,
        paymentMethod: sale.payMethod === "cash" ? "CASH" : sale.payMethod === "card" ? "CREDIT_CARD" : "E_WALLET",
        totalAmount: sale.total
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        // Cập nhật lại ghế thành isBooked
        setRealtimeSeats(prev => prev.map(s => selectedSeatIds.includes(s.id) ? { ...s, isBooked: true } : s));
        setSelectedSeatIds([]);
        setSnackQty({});
        closeModal();
      } else {
        toast.error("Lỗi khi lưu đơn hàng vào DB: " + data.error);
      }
    }).catch(err => {
      toast.error("Không thể kết nối đến server");
    });
  }

  function handlePrintReceipt() {
    if (!sale) {
      toast.error("Nothing to print");
      return;
    }
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      toast.success("Print job sent — sale recorded.");
      finalizePrintedSale();
    };
    window.addEventListener("afterprint", run, { once: true });
    window.print();
    window.setTimeout(run, 900);
  }

  const payLabel: Record<PayMethod, string> = {
    cash: "Cash",
    card: "Credit Card",
    bank_qr: "Banking QR",
  };

  return (
    <StaffRouteGuard allow={["STAFF", "ADMIN"]}>
      <Toaster theme="dark" position="top-center" richColors closeButton />
      <StaffPage
        title="Counter Sales (POS)"
        subtitle={currentShowtime 
          ? `${currentShowtime.movie.title} · ${new Date(currentShowtime.startTime).toLocaleTimeString("vi-VN")} · ${currentShowtime.room.name}`
          : "Đang tải suất chiếu..."}
        actions={
          <button
            type="button"
            onClick={openPaymentModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all active:scale-[0.98]"
            style={{
              fontWeight: 800,
              fontSize: "0.82rem",
              background: `linear-gradient(135deg,${SC.red},#c8111f)`,
              boxShadow: "0 4px 20px rgba(232,25,44,0.38)",
              letterSpacing: "0.06em",
            }}
          >
            <Receipt size={16} /> Confirm order
          </button>
        }
      >
        <div className="flex flex-col xl:flex-row gap-6 pt-6">
          <section
            className="xl:w-[55%] rounded-3xl border p-6"
            style={{ backgroundColor: SC.cardAlt, borderColor: SC.border, boxShadow: "0 14px 50px rgba(0,0,0,0.35)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Layers size={16} style={{ color: SC.red }} />
              <h2 className="text-white" style={{ fontWeight: 800, fontSize: "0.92rem", letterSpacing: "-0.02em" }}>
                Seat mini-map
              </h2>
              <span className="ml-auto text-white/35" style={{ fontSize: "0.72rem" }}>
                {currentShowtime?.room?.name}
              </span>
            </div>

            <div
              className="mb-6 rounded-xl py-3 text-center text-white/25 uppercase mx-auto max-w-xl"
              style={{
                letterSpacing: "0.38em",
                fontSize: "0.55rem",
                fontWeight: 800,
                border: `1px solid ${SC.border}`,
                background:
                  "linear-gradient(180deg, rgba(232,25,44,0.08) 0%, rgba(255,255,255,0.02) 70%, transparent 100%)",
                boxShadow: "inset 0 0 40px rgba(232,25,44,0.06)",
              }}
            >
              Screen
            </div>

            <div className="overflow-x-auto flex flex-col items-center">
              {loadingSeats ? (
                <div className="text-white/50 py-10">Đang tải ghế...</div>
              ) : (
                Array.from(new Set(realtimeSeats.map((s) => s.row))).sort().map((row) => (
                  <div key={row} className="flex items-center gap-2 mb-2">
                    <div className="w-6 shrink-0 text-white/35 font-bold text-xs text-right pr-2">{row}</div>
                    {realtimeSeats
                      .filter((s) => s.row === row)
                      .sort((a, b) => a.number - b.number)
                      .map((seat) => {
                        const sold = seat.isBooked;
                        const selected = selectedSeatIds.includes(seat.id);
                        const isPremium = seat.type === "VIP";
                        const color = isPremium ? "#f5a623" : "#4a90e2";
                        
                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={sold}
                        onClick={() => toggleSeat(seat)}
                        title={
                          sold
                            ? `Ghế ${seat.row}${seat.number} · Đã bán`
                            : selected
                              ? `Ghế ${seat.row}${seat.number} · Đang chọn`
                              : `Ghế ${seat.row}${seat.number} (${seat.type})`
                        }
                        className="w-8 h-8 rounded-md shrink-0 transition-all disabled:opacity-100 disabled:cursor-not-allowed active:scale-95 text-[10px] font-bold text-white flex items-center justify-center"
                        style={{
                          border: sold
                            ? `1px solid #7f1d1d`
                            : selected
                              ? `1px solid ${SC.red}`
                              : isPremium
                                ? `1px solid ${color}88`
                                : `1px solid rgba(255,255,255,0.06)`,
                          backgroundColor: sold
                            ? "rgba(127,29,29,0.85)"
                            : selected
                              ? "rgba(232,25,44,0.22)"
                              : isPremium
                                ? `${color}18`
                                : "rgba(255,255,255,0.04)",
                          boxShadow:
                            selected
                              ? `0 0 14px rgba(232,25,44,0.25)`
                              : isPremium && !sold
                                ? `0 0 10px rgba(139,92,246,0.18)`
                                : "none",
                        }}
                      >
                        {sold ? "X" : `${seat.row}${seat.number}`}
                      </button>
                    );
                  })}
                  </div>
                ))
              )}
            </div>

            <p className="mt-4 text-white/35" style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
              <span style={{ color: SC.red, fontWeight: 700 }}>Red outline</span> = in this order.{" "}
              <span style={{ color: "#fca5a5", fontWeight: 700 }}>Dark red fill</span> = sold (offline); stays blocked for
              the next guest.
            </p>
          </section>

          <section className="flex-1 rounded-3xl border p-6" style={{ backgroundColor: SC.card, borderColor: SC.border }}>
            <div className="flex items-center gap-2 mb-4">
              <Ticket size={16} style={{ color: SC.green }} />
              <h2 className="text-white" style={{ fontWeight: 800, fontSize: "0.92rem" }}>
                Concessions
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SNACK_ITEMS.map((s) => {
                const q = snackQty[s.id] ?? 0;
                return (
                  <div
                    key={s.id}
                    className="rounded-2xl border p-4 flex gap-3"
                    style={{
                      borderColor: q > 0 ? "rgba(232,25,44,0.35)" : SC.border,
                      backgroundColor: q > 0 ? "rgba(232,25,44,0.06)" : "rgba(255,255,255,0.03)",
                    }}
                  >
                    <span
                      className="text-2xl flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border text-center leading-none"
                      style={{
                        borderColor: SC.border,
                        background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(20,20,33,0.9))",
                      }}
                      title={s.name}
                    >
                      {s.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">{s.name}</p>
                      <p className="text-white/40" style={{ fontSize: "0.72rem" }}>
                        {s.size}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: SC.red, fontWeight: 800, marginTop: 4 }}>
                        {formatVND(s.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSnack(s.id, -1)}
                        className="w-8 h-8 rounded-xl border flex items-center justify-center text-white/45 hover:border-red-400 hover:text-[#e8192c]"
                        style={{ borderColor: SC.border }}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-white font-mono">{q}</span>
                      <button
                        type="button"
                        onClick={() => setSnack(s.id, 1)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#e8192c] text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-6 rounded-2xl border px-5 py-4 flex items-center justify-between flex-wrap gap-3"
              style={{ borderColor: SC.borderHi, backgroundColor: "#0f0f18" }}
            >
              <div>
                <p style={{ fontSize: "0.65rem", color: SC.dim, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Estimated total (demo tax-free)
                </p>
                <p className="text-white mt-1" style={{ fontWeight: 900, fontSize: "1.85rem", letterSpacing: "-0.02em" }}>
                  {formatVND(grand)}
                </p>
              </div>
              <button
                type="button"
                onClick={openPaymentModal}
                className="px-5 py-2.5 rounded-xl text-white"
                style={{
                  fontWeight: 800,
                  backgroundColor: SC.red,
                  letterSpacing: "0.06em",
                  boxShadow: "0 6px 24px rgba(232,25,44,0.35)",
                  fontSize: "0.8rem",
                }}
              >
                Queue receipt
              </button>
            </div>
          </section>
        </div>

        {/* Payment + thermal overlay */}
        {modalPhase !== "closed" && (
          <div
            className="sf-modal-overlay fixed inset-0 z-[240] flex items-center justify-center p-4 sm:p-8"
            style={{ backgroundColor: "rgba(10,10,15,0.82)", backdropFilter: "blur(14px)" }}
            role="dialog"
            aria-modal
          >
            <div
              className="sf-modal-shell w-full max-w-lg rounded-3xl border overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: "rgba(18,18,28,0.98)",
                borderColor: SC.borderHi,
                boxShadow: "0 32px 90px rgba(0,0,0,0.75)",
              }}
            >
              {modalPhase === "pay" && (
                <>
                  <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: SC.border }}>
                    <div>
                      <p className="text-white/40 uppercase" style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.14em" }}>
                        Review &amp; payment
                      </p>
                      <h2 className="text-white mt-0.5" style={{ fontWeight: 900, fontSize: "1.05rem" }}>
                        {BOOKING.movie}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors"
                      style={{ borderColor: SC.border, color: SC.muted }}
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="px-6 py-5 space-y-4">
                    <div className="rounded-2xl border p-4" style={{ borderColor: SC.border, backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <p className="text-white/45 uppercase mb-3" style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.12em" }}>
                        Order summary
                      </p>
                      <ul className="space-y-2 text-sm" style={{ color: SC.muted }}>
                        {selectedSeatIds.map((id) => {
                          const seat = realtimeSeats.find(s => s.id === id);
                          if (!seat) return null;
                          const price = seat.type === "VIP" ? (currentShowtime?.priceBase || 80000) + 20000 : (currentShowtime?.priceBase || 80000);
                          return (
                            <li key={id} className="flex justify-between gap-3">
                              <span className="text-white font-mono">Ghế {seat.row}{seat.number}</span>
                              <span>
                                {seat.type} · {formatVND(price)}
                              </span>
                            </li>
                          );
                        })}
                        {SNACK_ITEMS.filter((s) => (snackQty[s.id] ?? 0) > 0).map((s) => (
                          <li key={s.id} className="flex justify-between gap-3">
                            <span className="text-white">
                              {s.emoji} {s.name} ×{snackQty[s.id]}
                            </span>
                            <span>{formatVND(s.price * (snackQty[s.id] ?? 0))}</span>
                          </li>
                        ))}
                      </ul>
                      <div
                        className="mt-4 pt-3 flex justify-between items-center border-t"
                        style={{ borderColor: SC.border }}
                      >
                        <span style={{ fontWeight: 800, color: SC.dim, fontSize: "0.72rem", letterSpacing: "0.1em" }}>TOTAL</span>
                        <span className="text-white" style={{ fontWeight: 900, fontSize: "1.25rem" }}>
                          {formatVND(grand)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/45 uppercase mb-2" style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.12em" }}>
                        Payment method
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {(
                          [
                            { id: "cash" as const, label: "Cash", Icon: Wallet },
                            { id: "card" as const, label: "Credit Card", Icon: CreditCard },
                            { id: "bank_qr" as const, label: "Banking QR", Icon: Smartphone },
                          ] as const
                        ).map(({ id, label, Icon }) => {
                          const sel = payMethod === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => {
                                setPayMethod(id);
                                if (id !== "cash") setCashTenderFormatted("");
                              }}
                              className="flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border duration-200 transition-colors"
                              style={{
                                borderColor: sel ? "rgba(232,25,44,0.45)" : SC.border,
                                backgroundColor: sel ? SC.redSoft : "rgba(255,255,255,0.02)",
                                color: sel ? SC.red : SC.muted,
                                fontWeight: sel ? 800 : 600,
                                fontSize: "0.72rem",
                              }}
                            >
                              <Icon size={20} />
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {payMethod === "cash" && (
                      <label className="block">
                        <span className="text-white/45 text-xs font-bold uppercase tracking-widest">Cash tendered (₫)</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={cashTenderFormatted}
                          onChange={(e) => setCashTenderFormatted(formatDigitsAsCurrencyTyping(e.target.value))}
                          placeholder="Amount guest hands over"
                          className="mt-2 w-full rounded-2xl px-4 py-3 text-white outline-none"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.04)",
                            border: `1px solid ${SC.border}`,
                            fontWeight: 700,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        />
                      </label>
                    )}

                    {payMethod === "bank_qr" && (
                      <div
                        className="rounded-2xl border p-5 text-center"
                        style={{ borderColor: SC.border, backgroundColor: "#fff", color: "#0a0a0f" }}
                      >
                        <p style={{ fontWeight: 800, fontSize: "0.78rem", marginBottom: 12 }}>Scan to pay (demo)</p>
                        <BankingQrPlaceholder />
                        <p className="mt-3" style={{ fontSize: "0.68rem", opacity: 0.55 }}>
                          Placeholder QR — connect your PSP in production.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={confirmPayment}
                      className="w-full py-3.5 rounded-2xl text-white"
                      style={{
                        fontWeight: 900,
                        letterSpacing: "0.06em",
                        background: `linear-gradient(135deg,${SC.red},#99101c)`,
                        boxShadow: "0 10px 32px rgba(232,25,44,0.38)",
                      }}
                    >
                      Confirm payment
                    </button>
                  </div>
                </>
              )}

              {modalPhase === "thermal" && sale && (
                <div className="p-6 sm:p-8">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-white/50" style={{ fontSize: "0.72rem", fontWeight: 700 }}>
                      Thermal ticket preview
                    </p>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-white/35 hover:text-white text-xs font-bold"
                    >
                      Cancel sale
                    </button>
                  </div>

                  <div
                    id="staff-pos-thermal-slip"
                    className="mx-auto text-black bg-white px-5 py-6 font-mono text-xs leading-relaxed"
                    style={{
                      maxWidth: 280,
                      border: "2px dashed #000",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                    }}
                  >
                    <div className="text-center border-b-2 border-dashed border-black pb-3 mb-3">
                      <p style={{ fontWeight: 900, fontSize: "0.95rem", letterSpacing: "0.06em" }}>{currentShowtime?.room?.name}</p>
                      <p style={{ fontSize: "0.65rem", marginTop: 4, opacity: 0.75 }}>Rạp chiếu phim CINEVERSE</p>
                      <p style={{ fontWeight: 800, fontSize: "0.7rem", marginTop: 8 }}>ADMISSION RECEIPT</p>
                    </div>
                    <p style={{ fontWeight: 800 }}>{currentShowtime?.movie?.title}</p>
                    <p className="opacity-80">Thời lượng: {currentShowtime?.movie?.duration} phút</p>
                    <div className="my-3 space-y-0.5 border-y border-dashed border-black py-2">
                      <p>{new Date(currentShowtime?.startTime).toLocaleDateString("vi-VN")}</p>
                      <p>{new Date(currentShowtime?.startTime).toLocaleTimeString("vi-VN")} · 2D</p>
                      <p style={{ marginTop: 6, fontWeight: 800 }}>
                        REF {sale.bookingRef}
                      </p>
                      <p style={{ marginTop: 6 }}>
                        Seats: {sale.seatLines.length ? sale.seatLines.map((l) => l.id).join(", ") : "—"}
                      </p>
                      <p>Payment: {payLabel[sale.payMethod]}</p>
                    </div>
                    {sale.snackLines.length > 0 && (
                      <div className="mb-3 border-b border-dashed border-black pb-2">
                        <p style={{ fontWeight: 800, marginBottom: 4 }}>Concessions</p>
                        {sale.snackLines.map((l) => (
                          <p key={l.name} className="flex justify-between gap-2">
                            <span>
                              {l.name} ×{l.qty}
                            </span>
                            <span>{formatVND(l.sub)}</span>
                          </p>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between font-black text-sm border-t-2 border-dashed border-black pt-2">
                      <span>TOTAL</span>
                      <span>{formatVND(sale.total)}</span>
                    </div>
                    <div className="flex flex-col items-center mt-4 pt-2 border-t border-dashed border-black">
                      <p style={{ fontSize: "0.62rem", fontWeight: 800, marginBottom: 6 }}>ENTRY / SOÁT VÉ</p>
                      <div className="p-1 bg-white inline-block border-2 border-black">
                        <QRCodeSVG value={sale.qrPayload} size={112} bgColor="#ffffff" fgColor="#000000" level="M" />
                      </div>
                      <p style={{ fontSize: "0.55rem", marginTop: 8, textAlign: "center", opacity: 0.65 }}>
                        Present at gate · {sale.qrPayload.slice(0, 36)}…
                      </p>
                    </div>
                    <p className="text-center mt-4" style={{ fontSize: "0.55rem", opacity: 0.5 }}>
                      Thank you — enjoy the show
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white"
                    style={{
                      fontWeight: 900,
                      letterSpacing: "0.06em",
                      backgroundColor: "#0a0a0f",
                      border: `2px dashed ${SC.borderHi}`,
                    }}
                  >
                    <Printer size={18} /> Print
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <style>{`
          @keyframes staffPosModalFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes staffPosModalPop {
            from { opacity: 0; transform: scale(0.94) translateY(12px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .sf-modal-overlay {
            animation: staffPosModalFade 0.22s ease-out both;
          }
          .sf-modal-shell {
            animation: staffPosModalPop 0.32s cubic-bezier(0.34, 1.25, 0.64, 1) both;
          }
          @media print {
            body { background: #fff !important; }
            body * { visibility: hidden !important; }
            #staff-pos-thermal-slip,
            #staff-pos-thermal-slip * { visibility: visible !important; }
            #staff-pos-thermal-slip {
              position: absolute !important;
              left: 50% !important;
              top: 12mm !important;
              transform: translateX(-50%) !important;
              box-shadow: none !important;
              max-width: 72mm !important;
              border: 2px dashed #000 !important;
            }
          }
        `}</style>
      </StaffPage>
    </StaffRouteGuard>
  );
}
