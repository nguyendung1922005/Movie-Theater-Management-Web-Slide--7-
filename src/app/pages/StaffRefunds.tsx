import { Undo2 } from "lucide-react";
import { StaffPage, SC } from "../components/StaffLayout";
import { StaffRouteGuard } from "../components/StaffRouteGuard";

export function StaffRefunds() {
  const rows = [
    { booking: "TH-MNO7890", movie: "Dark Hollow", reason: "Show cancelled", amt: "-130 000 ₫", status: "Queued" },
    { booking: "TH-FAKE9876", movie: "(Unknown)", reason: "Fraud flagged", amt: "+0 ₫", status: "Frozen" },
  ];

  return (
    <StaffRouteGuard allow={["counter_staff"]}>
      <StaffPage title="Refund / Cancel" subtitle="Supervisor-required actions · illustrative queue">
        <div className="pt-8 overflow-x-auto rounded-3xl border" style={{ borderColor: SC.border, backgroundColor: SC.card }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: `1px solid ${SC.border}` }}>
                {["Booking", "Film", "Reason", "Refund", "State"].map((h) => (
                  <th
                    key={h}
                    className="py-5 px-6 text-[0.61rem] font-black uppercase tracking-[0.2em]"
                    style={{ color: SC.dim }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.booking} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                  <td className="py-4 px-6 font-mono text-white text-sm">{row.booking}</td>
                  <td className="py-4 px-6">{row.movie}</td>
                  <td className="py-4 px-6 text-white/50 text-sm">{row.reason}</td>
                  <td className="py-4 px-6 font-mono font-bold" style={{ color: SC.green }}>
                    {row.amt}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className="rounded-full px-3 py-1 text-[0.6rem] font-black uppercase"
                      style={{ backgroundColor: SC.redSoft, color: SC.red, border: `1px solid rgba(232,25,44,0.28)` }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-10 text-center opacity-65 flex flex-col items-center gap-4">
            <Undo2 />
            Demo list only — integrates with ticketing API in production builds.
          </div>
        </div>
      </StaffPage>
    </StaffRouteGuard>
  );
}
