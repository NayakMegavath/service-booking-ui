import { ServiceProvider } from "./service-provider";

export interface Booking {
    id: number;
    serviceType: string;
    appointmentDate:  Date | null;
    status: string;
    serviceProfesionalId: number,
    clientId: number,
    serviceProfessional: ServiceProvider;
    amountPaid: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
  }