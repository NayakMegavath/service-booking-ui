import { ServiceProvider } from "./service-provider";

export interface Booking {
    id: number;
    serviceType: string;
    appointmentDate: string;
    status: string;
    serviceProfesionalId: number,
    clientId: number,
    serviceProfessional: ServiceProvider;
    amountPaid: string;
  }