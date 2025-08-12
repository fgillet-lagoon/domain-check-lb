import { useState } from "react";
import { Search, CheckCircle, XCircle, ArrowRight, Info, Calendar, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface DomainCheckResult {
  domain: string;
  available: boolean;
  alternatives?: Array<{domain: string, available: boolean}>;
  domainInfo?: any;
}

export function DomainChecker() {
  const [domainName, setDomainName] = useState("");
  const [extension, setExtension] = useState(".nc");
  const [checkedDomain, setCheckedDomain] = useState<string | null>(null);

  const { data: domainCheck, isLoading, error } = useQuery<DomainCheckResult>({
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

            {/* Domain information for .nc domains that are not available */}
            {!domainCheck.available && domainCheck.domain.endsWith('.nc') && domainCheck.domainInfo && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Info className="text-blue-600 mr-2" size={16} />
                  Informations sur le domaine {domainCheck.domain}
                </h4>
                <div className="space-y-3 text-sm">
                  {domainCheck.domainInfo.titulaire && (
                    <div className="flex items-start">
                      <User className="text-blue-600 mr-2 mt-0.5" size={14} />
                      <div>
                        <span className="font-medium text-blue-800">Titulaire:</span>
                        <p className="text-blue-700">{domainCheck.domainInfo.titulaire}</p>
                      </div>
                    </div>
                  )}
                  {domainCheck.domainInfo.contact_administratif && (
                    <div className="flex items-start">
                      <Building className="text-blue-600 mr-2 mt-0.5" size={14} />
                      <div>
                        <span className="font-medium text-blue-800">Contact administratif:</span>
                        <p className="text-blue-700">{domainCheck.domainInfo.contact_administratif}</p>
                      </div>
                    </div>
                  )}
                  {domainCheck.domainInfo.date_creation && (
                    <div className="flex items-center">
                      <Calendar className="text-blue-600 mr-2" size={14} />
                      <span className="font-medium text-blue-800">Date de création:</span>
                      <span className="text-blue-700 ml-2">
                        {new Date(domainCheck.domainInfo.date_creation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                  {domainCheck.domainInfo.date_expiration && (
                    <div className="flex items-center">
                      <Calendar className="text-blue-600 mr-2" size={14} />
                      <span className="font-medium text-blue-800">Date d'expiration:</span>
                      <span className="text-blue-700 ml-2">
                        {new Date(domainCheck.domainInfo.date_expiration).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                  {domainCheck.domainInfo.serveurs_dns && domainCheck.domainInfo.serveurs_dns.length > 0 && (
                    <div className="flex items-start">
                      <Info className="text-blue-600 mr-2 mt-0.5" size={14} />
                      <div>
                        <span className="font-medium text-blue-800">Serveurs DNS:</span>
                        <ul className="text-blue-700 ml-2 list-disc list-inside">
                          {domainCheck.domainInfo.serveurs_dns.map((dns: string, index: number) => (
                            <li key={index}>{dns}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                      <span className="text-sm font-medium text-green-600">Disponible</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


      </CardContent>
    </Card>
  );
}
