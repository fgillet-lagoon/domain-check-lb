import { Link, useLocation } from "wouter";
import { Globe, Home, List, LogOut } from "lucide-react";
import logoPath from "@assets/lagoon-business-logo_1754953144244.png";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout, isLoggingOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <img src={logoPath} alt="Lagoon Business" className="h-8" />
              <div>
                <p className="text-xs text-[var(--gray-light)]">Vérification nom de domaine</p>
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
{user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Bonjour, <span className="font-medium">{user.username}</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  data-testid="button-logout"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  {isLoggingOut ? "..." : "Déconnexion"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
