import { DISCLAIMER_TEXT } from "@/lib/site";

export default function Disclaimer() {
  return (
    <p className="border-l-2 border-amber-500 pl-3 text-xs leading-relaxed text-gray-600">
      {DISCLAIMER_TEXT}
    </p>
  );
}
