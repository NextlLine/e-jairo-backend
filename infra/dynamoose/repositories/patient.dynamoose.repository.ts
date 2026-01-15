import { Patient } from "../../../domain/patient/patient.entity";
import { PatientRepository } from "../../../domain/patient/patient.repository";
import { AppTable } from "../table";

export class PatientDynamooseRepository implements PatientRepository {
  async create(patient: Patient): Promise<Patient> {
    await AppTable.create({
      PK: `PATIENT#${patient.id}`,
      SK: "PROFILE",

      GSI1PK: `TEAM#${patient.teamId}`,
      GSI1SK: `PATIENT#${patient.id}`,

      entity: "PATIENT",

      ...patient,
    });

    return patient;
  }

  async findById(patientId: string): Promise<Patient | null> {
    const item = await AppTable.get({
      PK: `PATIENT#${patientId}`,
      SK: "PROFILE"
    });

    if (!item) {
      return null;
    }
    
    return new Patient(
      item.id,
      item.name,
      item.motherName,
      item.birthDate,
      item.teamId,
      item.createdAt,
      item.updatedAt
    );
  }

  async listByTeam(teamId: string): Promise<Patient[]> {
    const items = await AppTable.query("GSI1PK")
      .eq(`TEAM#${teamId}`)
      .using("GSI1")
      .exec();

    return items.map((item) =>
      new Patient(
        item.id,
        item.name,
        item.motherName,
        item.birthDate,
        item.teamId,
        item.createdAt,
        item.updatedAt
      )
    );
  }
}
