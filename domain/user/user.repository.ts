import { User } from "./user.entity";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(userData: User): Promise<User>;
  update(id: string, updateData: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
