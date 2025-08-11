import { useState } from "react";
import { DomainChecker } from "@/components/domain-checker";
import { PackageSelector } from "@/components/package-selector";
import { BookingForm } from "@/components/booking-form";
import type { Package } from "@shared/schema";

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [availableDomain, setAvailableDomain] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleDomainAvailable = (domain: string) => {
    setAvailableDomain(domain);
    if (selectedPackage) {
      setShowBookingForm(true);
    }
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    if (availableDomain) {
      setShowBookingForm(true);
    }
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Domain Check and Booking Section */}
        <div className="lg:col-span-2 space-y-8">
          <DomainChecker onDomainAvailable={handleDomainAvailable} />
          
          {showBookingForm && availableDomain && selectedPackage && (
            <BookingForm
              domain={availableDomain}
              selectedPackage={selectedPackage}
              onCancel={handleCancelBooking}
            />
          )}
        </div>

        {/* Packages Section */}
        <div>
          <PackageSelector
            selectedPackage={selectedPackage}
            onPackageSelect={handlePackageSelect}
          />
        </div>
      </div>
    </div>
  );
}
