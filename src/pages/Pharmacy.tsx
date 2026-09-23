import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Phone, Navigation, Stethoscope, MapPin, FileText, Share2 } from "lucide-react";
import { LocationCard } from "@/components/LocationCard";

const Pharmacy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as any) || {};

  const place = {
    name: "صيدلية الشفاء",
    distance: "350 م",
    eta: "دقيقتان",
    phone: "+201112223344",
    address: "شارع النيل، بجوار البنك الأهلي",
  };

  return (
    <div dir="rtl" className="phone-frame bg-background pt-6 pb-10">
      <header className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-card border border-border text-primary active:scale-95"
        >
          <ArrowRight size={18} />
        </button>
        <h2 className="text-base font-semibold text-foreground">أقرب صيدلية</h2>
        <div className="w-10" />
      </header>

      <LocationCard pinColor="hsl(145 65% 42%)" pinLabel="صيدلية" />

      <div className="mt-4 rounded-3xl bg-card border border-border p-5">
        <div className="flex items-start justify-between">
          <div className="text-right">
            <h3 className="text-base font-bold text-foreground">{place.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{place.address}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin size={12} /> {place.distance}</span>
              <span>•</span>
              <span>{place.eta}</span>
            </div>
          </div>
          <span className="px-2 py-1 text-[10px] rounded-full bg-green-50 text-green-700 font-semibold">مفتوحة الآن</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <a href={`tel:${place.phone}`} className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold bg-primary text-primary-foreground active:scale-[.98]">
            <Phone size={14} /> اتصل
          </a>
          <button className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold bg-card border border-border text-foreground active:scale-[.98]">
            <Navigation size={14} /> الاتجاهات
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <button
          onClick={() => navigate("/first-aid", { state: { level: state.level, withSupplies: true } })}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold bg-primary text-primary-foreground active:scale-[.98] shadow-[0_10px_22px_-10px_hsl(var(--primary))]"
        >
          <Stethoscope size={16} /> عرض الإسعافات الأولية
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/medical-report", { state })}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold bg-card border border-border text-foreground active:scale-[.98]"
          >
            <FileText size={16} /> التقرير الطبي للحالة
          </button>
          <button
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("تقرير نبض الطبي")}`, "_blank")}
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-card border border-border text-primary active:scale-95"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;
