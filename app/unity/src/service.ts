import z from "zod";
import { UnityRepository } from "../../../domain/unity/unity.repository";
import { Unity } from "../../../domain/unity/unity.entity";
import { randomUUID } from "crypto";

const CreateUnitySchema = z.object({
    name: z.string().min(3).max(50),
    phone: z.string().min(10).max(15).nullable().optional(),
});

export class UnityService {
    constructor(private readonly unityRepository: UnityRepository) { }

    async createUnity(data: z.infer<typeof CreateUnitySchema>) {
        const validatedData = CreateUnitySchema.parse(data);

        const newUnity = new Unity(
            randomUUID(),
            validatedData.name,
            validatedData.phone ?? null,
        );

        return this.unityRepository.create(newUnity);
    }
}