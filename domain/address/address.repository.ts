import { Address } from "./address.entity";

export interface AddressRepository {
    create(entityId: string, addressEntityType: string, address: Address): Promise<Address>;
    getByEntityId(entityId: string, addressEntityType: string): Promise<Address | null>;
}