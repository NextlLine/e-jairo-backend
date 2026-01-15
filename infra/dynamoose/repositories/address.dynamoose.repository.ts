import { Address } from "../../../domain/address/address.entity";
import { AddressRepository } from "../../../domain/address/address.repository";
import { AddressEntityType } from "../../../domain/types/AddressEntityType";
import { AppTable } from "../table";

export class AddressDynamooseRepository implements AddressRepository {
  async create(entityId: string, addressEntityType: AddressEntityType, address: Address): Promise<Address> {
    await AppTable.create({
      PK: `${addressEntityType}#${entityId}`,
      SK: "ADDRESS",

      entity: "ADDRESS",

      country: "Brasil",
      ...address,
    });

    return address;
  }

  async getByEntityId(entityId: string, addressEntityType: AddressEntityType): Promise<Address | null> {
    const item = await AppTable.get({
      PK: `${addressEntityType}#${entityId}`,
      SK: "ADDRESS",
    });

    if (!item) return null;
    
    return new Address(
      item.street,
      item.city,
      item.state,
      item.zipCode,
      item.country
    );
  }
}