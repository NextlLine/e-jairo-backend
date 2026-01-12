import { Patient } from "./patient.entity";

export interface PatientRepository {
  create(patient: Patient): Promise<Patient>;
  findById(patientId: string): Promise<Patient | null>;
  listByTeam(teamId: string): Promise<Patient[]>;
}