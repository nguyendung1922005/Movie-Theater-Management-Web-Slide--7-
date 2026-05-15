import { useState, useMemo } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { StaffPage, SC } from "../components/StaffLayout";
import { StaffRouteGuard } from "../components/StaffRouteGuard";
import { EMAIL_REGEX, normalizePhoneDigits, PHONE_10_REGEX } from "../lib/inputFormat";

type Field = "name" | "phone" | "email";

export function StaffMembers() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});

  const phoneDigits = useMemo(() => normalizePhoneDigits(phone), [phone]);
  const phoneOk = PHONE_10_REGEX.test(phoneDigits);
  const emailOk = email.trim() === "" ? false : EMAIL_REGEX.test(email.trim());
  const nameOk = name.trim().length >= 2;

  const phoneInvalid = touched.phone && !phoneOk;
  const emailInvalid = touched.email && !emailOk;
  const nameInvalid = touched.name && !nameOk;

  function submit() {
    setTouched({ name: true, phone: true, email: true });
    if (!nameOk || !phoneOk || !emailOk) {
      toast.error("Fix the highlighted fields", { description: "10-digit phone (0…), valid email, name ≥ 2 chars." });
      return;
    }
    toast.success("Member saved (demo)", { description: `${name.trim()} · ${phoneDigits}` });
    setName("");
    setPhone("");
    setEmail("");
    setTouched({});
  }

  const inputBase =
    "mt-1.5 w-full px-4 py-3 rounded-2xl border bg-transparent outline-none transition-colors duration-200 focus:border-[#e8192c]";

  return (
    <StaffRouteGuard allow={["counter_staff"]}>
      <StaffPage title="Member Registration" subtitle="Onboard loyalty members at the ticket counter · demo form">
        <div className="pt-8 max-w-xl mx-auto rounded-3xl border p-8" style={{ borderColor: SC.border, backgroundColor: SC.card }}>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: SC.redSoft, border: `1px solid rgba(232,25,44,0.28)` }}
              title="New loyalty enrolment"
            >
              <UserPlus className="text-[#e8192c]" size={20} />
            </div>
            <div>
              <p style={{ fontSize: "0.58rem", color: SC.dim, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                New enrolment
              </p>
              <p className="text-white mt-1" style={{ fontWeight: 900, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
                Quick register
              </p>
            </div>
          </div>

          <label className="block mb-4">
            <span style={{ fontSize: "0.72rem", color: SC.muted }}>Full name</span>
            <input
              className={inputBase}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              placeholder="Nguyen Van A"
              style={{
                borderColor: nameInvalid ? SC.red : SC.border,
                color: SC.text,
                boxShadow: nameInvalid ? `0 0 0 1px ${SC.red}33` : undefined,
              }}
            />
            {nameInvalid && <p className="mt-1 text-xs" style={{ color: SC.red }}>Enter at least 2 characters.</p>}
          </label>

          <label className="block mb-4">
            <span style={{ fontSize: "0.72rem", color: SC.muted }}>Phone (10 digits, starts with 0)</span>
            <input
              className={inputBase}
              value={phone}
              inputMode="numeric"
              onChange={(e) => setPhone(normalizePhoneDigits(e.target.value))}
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              placeholder="0901234567"
              maxLength={10}
              style={{
                borderColor: phoneInvalid ? SC.red : SC.border,
                color: SC.text,
                fontVariantNumeric: "tabular-nums",
                boxShadow: phoneInvalid ? `0 0 0 1px ${SC.red}33` : undefined,
              }}
            />
            {phoneInvalid && <p className="mt-1 text-xs" style={{ color: SC.red }}>Use exactly 10 digits (e.g. 0901234567).</p>}
          </label>

          <label className="block mb-4">
            <span style={{ fontSize: "0.72rem", color: SC.muted }}>Email</span>
            <input
              className={inputBase}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="name@example.com"
              style={{
                borderColor: emailInvalid ? SC.red : SC.border,
                color: SC.text,
                boxShadow: emailInvalid ? `0 0 0 1px ${SC.red}33` : undefined,
              }}
            />
            {emailInvalid && <p className="mt-1 text-xs" style={{ color: SC.red }}>Enter a valid email address.</p>}
          </label>

          <button
            type="button"
            onClick={submit}
            className="mt-6 w-full py-3.5 rounded-2xl text-white font-black tracking-wider text-sm duration-200 transition-transform active:scale-[0.99]"
            style={{ background: `linear-gradient(135deg,${SC.red},#95101c)`, boxShadow: "0 8px 32px rgba(232,25,44,0.38)" }}
          >
            Submit registration
          </button>
        </div>
      </StaffPage>
    </StaffRouteGuard>
  );
}
