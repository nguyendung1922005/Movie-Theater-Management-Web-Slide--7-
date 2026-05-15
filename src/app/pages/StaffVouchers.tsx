import { useState } from "react";
import { Search, Ticket } from "lucide-react";
import { StaffPage, SC } from "../components/StaffLayout";
import { StaffRouteGuard } from "../components/StaffRouteGuard";
import { VOUCHERS, findVoucherByCode } from "../lib/commerceData";

export function StaffVouchers() {
  const [code, setCode] = useState("");
  const hit = code.trim() ? findVoucherByCode(code) : null;

  return (
    <StaffRouteGuard allow={["counter_staff"]}>
      <StaffPage title="Voucher Lookup" subtitle="Reads from same voucher catalog as Checkout promo validation">
        <div className="pt-8 max-w-screen-md">
          <div className="flex gap-3 flex-wrap mb-10">
            <div
              className="flex-1 flex items-center gap-2 px-5 py-3 rounded-2xl border min-w-[200px]"
              style={{ borderColor: SC.border, backgroundColor: "rgba(255,255,255,0.03)" }}
            >
              <Search size={16} style={{ color: SC.dim }} />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Promo code (e.g. CINEMA20)…"
                className="bg-transparent flex-1 outline-none text-white font-mono"
              />
            </div>
          </div>
          {hit ? (
            <div className="rounded-3xl border p-8" style={{ borderColor: SC.borderHi, backgroundColor: SC.card }}>
              <div className="flex gap-5 items-start flex-wrap">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: SC.redSoft, border: `1px solid rgba(232,25,44,0.28)` }}>
                  <Ticket style={{ color: SC.red }} size={26} />
                </div>
                <div>
                  <code className="text-white tracking-widest" style={{ fontSize: "1.5rem", fontWeight: 900 }}>
                    {hit.code}
                  </code>
                  <div className="mt-5 grid grid-cols-2 gap-x-14 gap-y-4 text-white/65 text-sm font-semibold uppercase tracking-wider">
                    <div>
                      Value
                      <p className="text-white text-lg normal-case">{hit.type === "percent" ? `${hit.value}%` : `${hit.value.toLocaleString("vi-VN")} ₫`}</p>
                    </div>
                    <div>
                      Expiry
                      <p className="text-white text-lg normal-case">{hit.expiry}</p>
                    </div>
                    <div className="col-span-2">
                      Status{" "}
                      <span style={{ color: hit.active ? SC.green : SC.red, fontWeight: 900 }}>
                        {hit.active ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border p-8 text-white/55" style={{ borderColor: SC.border, fontSize: "0.92rem", lineHeight: 1.7 }}>
              Known demo codes:{" "}
              {VOUCHERS.filter((x) => x.active)
                .map((v) => v.code)
                .join(", ")}{" "}
              ...
            </div>
          )}
        </div>
      </StaffPage>
    </StaffRouteGuard>
  );
}
