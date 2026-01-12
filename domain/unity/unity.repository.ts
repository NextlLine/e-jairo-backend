import { Unity } from "./unity.entity";

export interface UnityRepository {
  create(unity: Unity): Promise<Unity>;
  findById(unityId: string): Promise<Unity | null>;
}