import z from "zod";
import { AdvertisementRepository } from "../../../domain/advertisement/advertisement.repository";
import { Advertisement } from "../../../domain/advertisement/advertisement.entity";
import { randomUUID } from "crypto";
import { mapToHttpError } from "../../../shared/errors/map-http-error";

const createAdvertisementSchema = z.object({
    message: z.string(),
    teamId: z.string().uuid(),
});

const deleteAdvertisementSchema = z.object({
    adId: z.string(),
});

export class AdvertisementService {
    constructor(private readonly advertisementRepository: AdvertisementRepository) { }

    async create(adData: z.infer<typeof createAdvertisementSchema>) {
        const validatedAd = createAdvertisementSchema.parse(adData);

        const ad = new Advertisement(
            randomUUID(),
            validatedAd.message,
            validatedAd.teamId
        )

        try {
            await this.advertisementRepository.create(ad);
        } catch (error) {
            return mapToHttpError(error, "criar aviso");
        }
    }

    async listByTeam(teamId: string) {
        try {
            return await this.advertisementRepository.listByTeam(teamId);
        } catch (error) {
            return mapToHttpError(error, "listagem de avisos por time");

        }
    }

    async delete(adData: z.infer<typeof deleteAdvertisementSchema>) {
        const validatedAd = deleteAdvertisementSchema.parse(adData);
            console.log(`Deleting advertisement with ID: ${validatedAd.adId}`);

        try {
            const existingAds = await this.advertisementRepository.findById(validatedAd.adId);

            if (!existingAds) {
                throw new Error("Aviso não encontrado");
            }

            await this.advertisementRepository.delete(validatedAd.adId);
        } catch (error) {
            return mapToHttpError(error, "deletar aviso");
        }
    }
}