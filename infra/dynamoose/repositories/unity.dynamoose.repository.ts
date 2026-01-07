import { AppTable } from "../table";

export class UnityDynamooseRepository {
  async create(unity: {
    id: string;
    name: string;
    hash: string;
    address: string;
    phone: string;
  }) {
    return AppTable.create({
      PK: `UNITY#${unity.id}`,
      SK: "PROFILE",

      entity: "UNITY",

      ...unity,
    });
  }

  async findById(unityId: string) {
    return AppTable.get({
      PK: `UNITY#${unityId}`,
      SK: "PROFILE",
    });
  }
}
