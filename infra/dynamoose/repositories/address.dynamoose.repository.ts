import { AppTable } from "../table";

export class AddressDynamooseRepository {
  async upsert(patientId: string, address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }) {
    return AppTable.create({
      PK: `PATIENT#${patientId}`,
      SK: "ADDRESS",

      entity: "ADDRESS",

      country: "Brasil",
      ...address,
    });
  }

  async getByPatient(patientId: string) {
    return AppTable.get({
      PK: `PATIENT#${patientId}`,
      SK: "ADDRESS",
    });
  }
}
