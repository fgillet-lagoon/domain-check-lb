import { useState } from "react";
import { Search, CheckCircle, XCircle, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Package as PackageType } from "@shared/schema";

interface DomainCheckerProps {
  onDomainAvailable: (domain: string, selectedPackage: PackageType) => void;
}

interface DomainCheckResult {
  domain: string;
  available: boolean;
  alternatives?: Array<{domain: string, available: boolean}>;
}

export function DomainChecker({ onDomainAvailable }: DomainCheckerProps) {
  const [domainName, setDomainName] = useState("");
  const [extension, setExtension] = useState(".nc");
  const [checkedDomain, setCheckedDomain] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);

  const { data: domainCheck, isLoading, error } = useQuery<DomainCheckResult>({
    queryKey: ["/api/check", checkedDomain],
    enabled: !!checkedDomain,
    queryFn: () => api.checkDomain(checkedDomain!),
  });

  const { data: packages = [] } = useQuery({
    queryKey: ["/api/packages"],
    queryFn: api.getPackages,
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
          <div className="space-y-4">
            {/* Primary domain result */}
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

            {/* Alternative domains */}
            {domainCheck.alternatives && domainCheck.alternatives.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <ArrowRight className="text-blue-600 mr-2" size={16} />
                  Alternatives disponibles
                </h4>
                <div className="space-y-2">
                  {domainCheck.alternatives.map((alt, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-blue-100">
                      <div className="flex items-center">
                        <CheckCircle className="text-green-600 mr-2" size={16} />
                        <span className="font-medium text-[var(--gray-custom)]">{alt.domain}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          const extension = alt.domain.substring(alt.domain.lastIndexOf('.'));
                          const matchingPackage = packages.find((pkg: PackageType) => pkg.extension === extension);
                          if (matchingPackage) {
                            onDomainAvailable(alt.domain, matchingPackage);
                          }
                        }}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        Sélectionner
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {domainCheck?.available && (
          <div className="space-y-4">
            {/* Package Selection */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-[var(--gray-custom)] mb-3 flex items-center">
                <Package className="text-primary mr-2" size={16} />
                Choisissez votre forfait
              </h4>
              <div className="grid gap-3">
                {packages.map((pkg: PackageType) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPackage?.id === pkg.id
                        ? "border-primary bg-primary bg-opacity-5"
                        : "border-slate-200 hover:border-primary"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-medium text-[var(--gray-custom)]">{pkg.name}</h5>
                        <p className="text-sm text-[var(--gray-light)]">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary">
                          {pkg.price.toLocaleString()} XPF
                        </span>
                        <p className="text-xs text-[var(--gray-light)]">/an</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPackage && (
              <Button
                onClick={() => onDomainAvailable(domainCheck.domain, selectedPackage)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Réserver {domainCheck.domain} avec {selectedPackage.name}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
