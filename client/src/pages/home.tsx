import { useState } from "react";
import { DomainChecker } from "@/components/domain-checker";
import { BookingForm } from "@/components/booking-form";
import type { Package } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Home() {
  const [availableDomain, setAvailableDomain] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const { data: packages = [] } = useQuery({
    queryKey: ["/api/packages"],
    queryFn: api.getPackages,
  });

  const handleDomainAvailable = (domain: string, selectedPackage: Package) => {
    setAvailableDomain(domain);
    setSelectedPackage(selectedPackage);
    setShowBookingForm(true);
  };

  const handleCancelBooking = () => {
    setShowBookingForm(false);
    setAvailableDomain(null);
    setSelectedPackage(null);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[var(--gray-custom)] mb-4">
          Réservez votre nom de domaine
        </h2>
        <p className="text-xl text-[var(--gray-light)] max-w-2xl mx-auto">
          Vérifiez la disponibilité et réservez votre nom de domaine en quelques clics. 
          Extensions disponibles : .nc, .com, .net, .org
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <DomainChecker onDomainAvailable={handleDomainAvailable} />
        
        {showBookingForm && availableDomain && selectedPackage && (
          <BookingForm
            domain={availableDomain}
            selectedPackage={selectedPackage}
            onCancel={handleCancelBooking}
          />
        )}
      </div>
    </div>
  );
}
