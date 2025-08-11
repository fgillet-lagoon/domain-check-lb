import { useState } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface DomainCheckerProps {
  onDomainAvailable: (domain: string) => void;
}

export function DomainChecker({ onDomainAvailable }: DomainCheckerProps) {
  const [domainName, setDomainName] = useState("");
  const [extension, setExtension] = useState(".nc");
  const [checkedDomain, setCheckedDomain] = useState<string | null>(null);

  const { data: domainCheck, isLoading, error } = useQuery({
    queryKey: ["/api/check", checkedDomain],
    enabled: !!checkedDomain,
    queryFn: () => api.checkDomain(checkedDomain!),
  });

  const handleCheck = () => {
    if (!domainName.trim()) {
      alert("Veuillez saisir un nom de domaine");
      return;
    }
    
    const fullDomain = domainName.trim() + extension;
    setCheckedDomain(fullDomain);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCheck();
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--gray-custom)]">
          <Search className="text-primary" size={20} />
          Vérification de disponibilité
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--gray-custom)] mb-2">
            Nom de domaine
          </label>
          <div className="flex">
            <Input
              type="text"
              placeholder="exemple"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 rounded-r-none border-r-0 focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <Select value={extension} onValueChange={setExtension}>
              <SelectTrigger className="w-24 rounded-l-none rounded-r-none border-l-0 border-r-0 focus:ring-2 focus:ring-primary focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=".nc">.nc</SelectItem>
                <SelectItem value=".com">.com</SelectItem>
                <SelectItem value=".net">.net</SelectItem>
                <SelectItem value=".org">.org</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleCheck}
              disabled={isLoading}
              className="rounded-l-none bg-primary hover:bg-primary/90"
            >
              <Search size={16} className="mr-2" />
              {isLoading ? "Vérification..." : "Vérifier"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="text-red-600 mr-3" size={20} />
              <div>
                <h4 className="font-semibold text-red-800">Erreur</h4>
                <p className="text-sm text-red-700">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {domainCheck && (
          <div className={`p-4 rounded-lg border ${
            domainCheck.available 
              ? "bg-green-50 border-green-200" 
              : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-center">
              {domainCheck.available ? (
                <CheckCircle className="text-green-600 mr-3" size={20} />
              ) : (
                <XCircle className="text-red-600 mr-3" size={20} />
              )}
              <div>
                <h4 className={`font-semibold ${
                  domainCheck.available ? "text-green-800" : "text-red-800"
                }`}>
                  {domainCheck.domain} {domainCheck.available ? "est disponible !" : "n'est pas disponible"}
                </h4>
                <p className={`text-sm ${
                  domainCheck.available ? "text-green-700" : "text-red-700"
                }`}>
                  {domainCheck.available 
                    ? "Vous pouvez réserver ce domaine."
                    : "Ce domaine est déjà réservé."
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {domainCheck?.available && (
          <Button
            onClick={() => onDomainAvailable(domainCheck.domain)}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Procéder à la réservation
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
