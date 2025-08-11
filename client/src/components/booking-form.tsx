import { useState } from "react";
import { FileText, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { insertBookingSchema } from "@shared/schema";
import type { Package } from "@shared/schema";
import { z } from "zod";

const formSchema = insertBookingSchema.extend({
  customerName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Le téléphone est requis"),
});

interface BookingFormProps {
  domain: string;
  selectedPackage: Package;
  onCancel: () => void;
}

export function BookingForm({ domain, selectedPackage, onCancel }: BookingFormProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain,
      packageId: selectedPackage.id,
      customerName: "",
      email: "",
      phone: "",
      ridet: "",
      idDocument: "",
      notes: "",
      status: "réservé",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: api.bookDomain,
    onSuccess: (data) => {
      setBookingResult(data);
      setIsConfirmationOpen(true);
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      form.reset();
    },
    onError: (error) => {
      alert(`Erreur lors de la réservation: ${error.message}`);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    bookingMutation.mutate(values);
  };

  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
    setBookingResult(null);
    onCancel();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--gray-custom)]">
            <FileText className="text-primary" size={20} />
            Formulaire de réservation
          </CardTitle>
          <div className="text-sm text-[var(--gray-light)]">
            Domaine: <span className="font-semibold">{domain}</span> • 
            Package: <span className="font-semibold">{selectedPackage.name}</span>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet *</FormLabel>
                      <FormControl>
                        <Input {...field} className="focus:ring-2 focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} className="focus:ring-2 focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone *</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} className="focus:ring-2 focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ridet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RIDET</FormLabel>
                      <FormControl>
                        <Input {...field} className="focus:ring-2 focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="idDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pièce d'identité</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Numéro de pièce d'identité"
                        className="focus:ring-2 focus:ring-primary focus:border-primary" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes additionnelles</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={3}
                        className="focus:ring-2 focus:ring-primary focus:border-primary" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="border-slate-300 text-[var(--gray-light)] hover:bg-slate-50"
                >
                  <X size={16} className="mr-2" />
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={bookingMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Check size={16} className="mr-2" />
                  {bookingMutation.isPending ? "Réservation..." : "Confirmer la réservation"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-600" size={32} />
              </div>
              Réservation confirmée !
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-[var(--gray-light)]">Votre domaine a été réservé avec succès.</p>
            
            {bookingResult && (
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-[var(--gray-light)]">Numéro de réservation</p>
                <p className="text-lg font-bold text-primary">{bookingResult.bookingId}</p>
              </div>
            )}

            <Button onClick={closeConfirmation} className="w-full bg-primary hover:bg-primary/90">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
