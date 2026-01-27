import z from "zod";
import { UnityRepository } from "../../../domain/unity/unity.repository";
import { Unity } from "../../../domain/unity/unity.entity";
import { randomUUID } from "crypto";
import { mapToHttpError } from "../../../shared/errors/map-http-error";
import { HttpError } from "../../../shared/errors/http-error";
import { AddressRepository } from "../../../domain/address/address.repository";
import { UserRepository } from "../../../domain/user/user.repository";
import { verifyUserRole } from "../../../infra/dynamoose/shared/verify-user-permission";
import { UserRoles } from "../../../domain/types/UserRoles";

const CreateUnitySchema = z.object({
    name: z.string().min(3).max(50),
    phone: z.string().min(10).max(15).nullable().optional(),
    address: z.object({
        street: z.string().min(3).max(100).optional(),
        city: z.string().min(2).max(50).optional(),
        state: z.string().min(2).max(50).optional(),
        zipCode: z.string().min(4).max(10).optional(),
        country: z.string().min(2).max(50).optional(),
    }),
});

export class UnityService {
    constructor(
        private readonly unityRepository: UnityRepository,
        private readonly addressRepository: AddressRepository,
        private readonly userRepository: UserRepository
    ) { }

    async createUnity(data: z.infer<typeof CreateUnitySchema>, userSub: string) {
        await verifyUserRole(userSub, [UserRoles.MASTER], this.userRepository);

        const validatedData = CreateUnitySchema.parse(data);

        const newUnity = new Unity(
            randomUUID(),
            validatedData.name,
            validatedData.phone ?? null,
        );

        try {
            const unity = await this.unityRepository.create(newUnity);
            const address = await this.addressRepository.create(newUnity.id, "UNITY", validatedData.address);

            return {
                unity,
                address: address,
            }

        } catch (error: unknown) {
            if (error instanceof Error && error.name === "TransactionCanceledException") {
                throw new HttpError(409, "Unidade com este nome já existe");
            }

            return mapToHttpError(error, "criar unidade");
        }
    }
}