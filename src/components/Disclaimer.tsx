import { DISCLAIMER_TEXT } from "@/lib/site";

export default function Disclaimer() {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
      {DISCLAIMER_TEXT}
    </p>
  );
}
