import { Unity } from "../../../domain/unity/unity.entity";
import { UnityRepository } from "../../../domain/unity/unity.repository";
import { AppTable } from "../table";

export class UnityDynamooseRepository implements UnityRepository {
  async create(unity: Unity): Promise<Unity> {
    await AppTable.create({
      PK: `UNITY#${unity.id}`,
      SK: "PROFILE",

      entity: "UNITY",

      ...unity,
    });

    return unity;
  }

  async findById(unityId: string): Promise<Unity | null> {
    const item = await AppTable.get({
      PK: `UNITY#${unityId}`,
      SK: "PROFILE",
    });

    if (!item) return null;

    return new Unity(
      item.id,
      item.name,
      item.hash,
      item.address,
      item.phone
    );
  }
}

export const dynamooseUnityRepository = new UnityDynamooseRepository();