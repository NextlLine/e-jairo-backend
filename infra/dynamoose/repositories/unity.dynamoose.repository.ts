import { Unity } from "../../../domain/unity/unity.entity";
import { UnityRepository } from "../../../domain/unity/unity.repository";
import dynamoose from "../client";
import { AppTable } from "../table";

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}
class UnityDynamooseRepository implements UnityRepository {

  async create(unity: Unity): Promise<Unity> {
    const normalized = normalizeName(unity.name);

    const nameIndexItem = {
      PK: "UNITY_BY_NAME",
      SK: `NAME#${normalized}`,
      unityId: unity.id,
      entity: "UNITY_NAME_INDEX",
    };

    const unityItem = {
      PK: `UNITY#${unity.id}`,
      SK: "PROFILE",
      entity: "UNITY",
      ...unity,
    };

    const condition = new dynamoose.Condition()
      .where("PK").not().exists()
      .and()
      .where("SK").not().exists();

    await dynamoose.transaction([
      AppTable.transaction.create(nameIndexItem, { condition }),
      AppTable.transaction.create(unityItem),
    ]);

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
      item.phone,
    );
  }

  async findByName(name: string): Promise<Unity | null> {
    const indexItem = await AppTable.get({
      PK: "UNITY_BY_NAME",
      SK: `NAME#${normalizeName(name)}`,
    });

    if (!indexItem) return null;

    return this.findById(indexItem.unityId);
  }

}

export const dynamooseUnityRepository = new UnityDynamooseRepository();