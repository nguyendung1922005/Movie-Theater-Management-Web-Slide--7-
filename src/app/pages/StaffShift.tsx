import { Clock } from "lucide-react";
import { StaffPage, SC } from "../components/StaffLayout";

export function StaffShift() {
  return (
    <StaffPage title="Shift Management" subtitle="Clock In / Out is available in the portal header toolbar">
      <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-screen-lg">
        <div className="rounded-3xl border p-8" style={{ backgroundColor: SC.card, borderColor: SC.border }}>
          <div className="flex gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ border: `2px dashed ${SC.red}`, color: SC.red }}>
              <Clock size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="uppercase opacity-65 text-xs font-black tracking-[0.2em] mb-2">Operational notice</p>
              <ul className="text-white text-sm opacity-95 space-y-2 list-disc pl-4">
                <li>Ensure handover totals match POS summaries before Clock Out.</li>
                <li>Supervisor PIN required after 02:00 for late shifts.</li>
                <li>Breaks paused while clocked.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border p-8" style={{ borderColor: SC.border, backgroundImage: `linear-gradient(135deg,rgba(232,25,44,0.08),transparent)` }}>
          <p className="text-white uppercase text-xs opacity-60 font-black mb-10 tracking-[0.2em]">
            Today's mock attendance
          </p>
          {[
            { name: "Mai Nguyen", in: "14:42", notes: "Counter A" },
            { name: "Khoa Tran", in: "15:06", notes: "Soát vé cổng Đông" },
          ].map((u) => (
            <div
              key={u.name}
              className="py-7 border-t flex justify-between gap-4 flex-wrap"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div className="text-white font-bold">{u.name}</div>
              <div className="text-white opacity-65 text-sm">{u.notes}</div>
              <div className="text-[#e8192c] font-black font-mono text-sm tracking-wider">{u.in}</div>
            </div>
          ))}
        </div>
      </div>
    </StaffPage>
  );
}
