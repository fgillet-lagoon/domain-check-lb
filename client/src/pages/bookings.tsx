import { Eye, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Booking } from "@shared/schema";

export default function Bookings() {
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ["/api/bookings"],
    queryFn: api.getBookings,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-[var(--gray-custom)]">
            <List className="text-primary" size={24} />
            Liste des réservations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-[var(--gray-custom)]">
            <List className="text-primary" size={24} />
            Liste des réservations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Erreur lors du chargement des réservations: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "réservé":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">réservé</Badge>;
      case "en attente":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">en attente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="flex items-center gap-3 text-[var(--gray-custom)]">
          <List className="text-primary" size={24} />
          Liste des réservations
        </CardTitle>
        <p className="text-[var(--gray-light)] mt-1">Gérez toutes vos réservations de domaines</p>
      </CardHeader>

      <CardContent className="p-0">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <List className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-lg font-semibold text-[var(--gray-custom)] mb-2">
              Aucune réservation
            </h3>
            <p className="text-[var(--gray-light)]">
              Les réservations de domaines apparaîtront ici une fois créées.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-medium text-[var(--gray-light)] uppercase tracking-wider">
                    ID
                  </TableHead>
                  <TableHead className="font-medium text-[var(--gray-light)] uppercase tracking-wider">
                    Domaine
                  </TableHead>
                  <TableHead className="font-medium text-[var(--gray-light)] uppercase tracking-wider">
                    Client
                  </TableHead>
                  <TableHead className="font-medium text-[var(--gray-light)] uppercase tracking-wider">
                    Email
                  </TableHead>
                  <TableHead className="font-medium text-[var(--gray-light)] uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="font-medium text-[var(--gray-light)] uppercase tracking-wider">
                    Statut
                  </TableHead>
                  <TableHead className="font-medium text-[var(--gray-light)] uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking: Booking) => (
                  <TableRow key={booking.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-[var(--gray-custom)]">
                      #{booking.id.toString().padStart(3, '0')}
                    </TableCell>
                    <TableCell className="text-[var(--gray-custom)]">
                      {booking.domain}
                    </TableCell>
                    <TableCell className="text-[var(--gray-custom)]">
                      {booking.customerName}
                    </TableCell>
                    <TableCell className="text-[var(--gray-light)]">
                      {booking.email}
                    </TableCell>
                    <TableCell className="text-[var(--gray-light)]">
                      {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status || "réservé")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80"
                      >
                        <Eye size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--gray-light)]">
                Affichage de {bookings.length} résultat{bookings.length > 1 ? 's' : ''} au total
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
