import { AppTable } from "../table";

export class PatientDynamooseRepository {
  async create(patient: {
    id: string;
    name: string;
    motherName: string;
    doc: string;
    phone: string;
    birthDate: string;
    teamId: string;
  }) {
    return AppTable.create({
      PK: `PATIENT#${patient.id}`,
      SK: "PROFILE",

      GSI1PK: `TEAM#${patient.teamId}`,
      GSI1SK: `PATIENT#${patient.id}`,

      entity: "PATIENT",

      ...patient,
    });
  }

  async findById(patientId: string) {
    const items = await AppTable.query("PK")
      .eq(`PATIENT#${patientId}`)
      .exec();

    return items;
  }

  async listByTeam(teamId: string) {
    return AppTable.query("GSI1PK")
      .eq(`TEAM#${teamId}`)
      .using("GSI1")
      .exec();
  }
}
