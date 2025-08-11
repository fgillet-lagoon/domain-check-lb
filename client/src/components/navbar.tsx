import { Link, useLocation } from "wouter";
import { Globe, Home, List } from "lucide-react";
import logoPath from "@assets/lagoon-business-logo_1754953144244.png";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <img src={logoPath} alt="Lagoon Business" className="h-8" />
              <div>
                <p className="text-xs text-[var(--gray-light)]">Réservation de domaines</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                  location === "/"
                    ? "bg-primary text-white"
                    : "text-[var(--gray-light)] hover:text-[var(--gray-custom)] hover:bg-slate-100"
                }`}
              >
                <Home size={16} />
                Accueil
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
