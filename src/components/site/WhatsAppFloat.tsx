function toWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("383")) return digits;
  if (digits.startsWith("0")) return `383${digits.slice(1)}`;
  return digits;
}

export default function WhatsAppFloat({ phone }: { phone: string }) {
  if (!phone) return null;
  const waNumber = toWhatsAppNumber(phone);
  const message = encodeURIComponent("Përshëndetje! Dëshiroj më shumë informata për Wing Tsun.");

  return (
    <a
      href={`https://wa.me/${waNumber}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Kontaktoni në WhatsApp"
      className="group fixed bottom-6 right-6 z-[150] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl shadow-black/20 transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white" aria-hidden="true">
        <path d="M16.02 2.667c-7.36 0-13.334 5.973-13.334 13.333 0 2.353.615 4.646 1.782 6.667L2.667 29.333l6.85-1.797a13.28 13.28 0 0 0 6.5 1.657h.006c7.36 0 13.333-5.973 13.333-13.333S23.38 2.667 16.02 2.667Zm0 24.4h-.005a11.05 11.05 0 0 1-5.632-1.542l-.404-.24-4.065 1.066 1.085-3.963-.263-.407a11.043 11.043 0 0 1-1.693-5.876c0-6.106 4.97-11.075 11.082-11.075 2.96 0 5.742 1.154 7.834 3.248a11 11 0 0 1 3.242 7.833c-.002 6.106-4.972 11.076-11.181 11.076Zm6.078-8.294c-.333-.167-1.97-.972-2.275-1.083-.305-.111-.527-.167-.75.167-.222.333-.86 1.083-1.055 1.305-.194.222-.388.25-.72.083-.334-.167-1.408-.519-2.682-1.653-.992-.885-1.663-1.978-1.858-2.311-.194-.334-.021-.514.146-.68.15-.15.334-.389.5-.583.167-.195.222-.334.334-.556.111-.222.055-.417-.028-.583-.083-.167-.75-1.807-1.028-2.474-.271-.65-.546-.562-.75-.573l-.639-.011c-.222 0-.583.083-.888.417-.305.333-1.167 1.14-1.167 2.78s1.195 3.225 1.361 3.446c.167.223 2.35 3.587 5.694 5.03.796.344 1.417.55 1.901.703.799.254 1.526.218 2.101.132.641-.096 1.97-.805 2.248-1.583.278-.778.278-1.445.194-1.584-.083-.139-.305-.222-.639-.389Z" />
      </svg>
    </a>
  );
}
