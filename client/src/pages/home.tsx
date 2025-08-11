import { DomainChecker } from "@/components/domain-checker";

export default function Home() {

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[var(--gray-custom)] mb-4">
          Vérifiez la disponibilité de votre nom de domaine
        </h2>
        <p className="text-xl text-[var(--gray-light)] max-w-2xl mx-auto">
          Découvrez instantanément si votre nom de domaine est disponible. 
          Extensions supportées : .nc, .com, .net, .org
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <DomainChecker />
      </div>
    </div>
  );
}
