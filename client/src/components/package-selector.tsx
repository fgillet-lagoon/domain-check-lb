import { useState } from "react";
import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Package as PackageType } from "@shared/schema";

interface PackageSelectorProps {
  selectedPackage: PackageType | null;
  onPackageSelect: (pkg: PackageType) => void;
}

export function PackageSelector({ selectedPackage, onPackageSelect }: PackageSelectorProps) {
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["/api/packages"],
    queryFn: api.getPackages,
  });

  if (isLoading) {
    return (
      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--gray-custom)]">
            <Package className="text-primary" size={20} />
            Forfaits disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 border border-slate-200 rounded-lg animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--gray-custom)]">
          <Package className="text-primary" size={20} />
          Forfaits disponibles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {packages.map((pkg: PackageType) => (
            <div
              key={pkg.id}
              onClick={() => onPackageSelect(pkg)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPackage?.id === pkg.id
                  ? "border-primary bg-primary bg-opacity-5"
                  : "border-slate-200 hover:border-primary"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-[var(--gray-custom)]">{pkg.name}</h4>
                  <p className="text-sm text-[var(--gray-light)]">{pkg.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-primary">
                    {pkg.price.toLocaleString()} XPF
                  </span>
                  <p className="text-xs text-[var(--gray-light)]">/an</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPackage && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[var(--gray-custom)]">
                Package sélectionné:
              </span>
              <span className="text-sm font-semibold text-primary">
                {selectedPackage.name}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
