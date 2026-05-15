import { Bell, Lock } from "lucide-react";
import { StaffPage, SC } from "../components/StaffLayout";

export function StaffProfileSettings() {
  return (
    <StaffPage title="Profile Settings" subtitle="Personal preferences scoped to theatre staff SSO (demo placeholders)">
      <div className="pt-8 max-w-xl space-y-8">
        {[
          {
            Icon: Bell,
            label: "Operational alerts push",
          },
          { Icon: Lock, label: "Require PIN reopening refunds modals" },
        ].map(({ Icon: Ico, label }) => (
          <div
            key={label}
            className="flex items-center gap-8 py-10 px-12 rounded-[2rem] justify-between cursor-pointer hover:border-white/[0.12] transition-colors border flex-wrap gap-y-4"
            style={{ borderColor: SC.border }}
          >
            <div className="flex gap-10 items-start">
              <Ico size={44} opacity={0.35} strokeWidth={2} />
              <div style={{ flex: "1 1 auto" }}>
                <p className="text-white text-xl font-semibold">{label}</p>
                <span className="text-white/[0.4] mt-6 block uppercase text-[0.6rem] font-black tracking-[0.2em] opacity-95">
                  Offline-only mock · no persistence
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </StaffPage>
  );
}
