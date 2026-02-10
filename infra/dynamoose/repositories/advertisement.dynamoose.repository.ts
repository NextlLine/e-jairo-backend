import { Advertisement } from "../../../domain/advertisement/advertisement.entity";
import { AdvertisementRepository } from "../../../domain/advertisement/advertisement.repository";
import { AppTable } from "../table";

class AdvertisementDynamooseRepository implements AdvertisementRepository {
    async listByTeam(teamId: string): Promise<Advertisement[]> {
        const items = await AppTable.query("GSI1PK")
            .eq(`TEAM#${teamId}`)
            .using("GSI1")
            .where("entity")
            .eq("ADVERTISEMENT")
            .sort("descending")
            .exec();

        return items.map((item) => new Advertisement(
            item.PK.split("#")[1],
            item.message,
            item.teamId
        ));
    }

    async create(advertisementData: Advertisement): Promise<Advertisement> {
        await AppTable.create({
            PK: `ADVERTISEMENT#${advertisementData.id}`,
            SK: `PROFILE`,

            GSI1PK: `TEAM#${advertisementData.teamId}`,
            GSI1SK: `ADVERTISEMENT#${advertisementData.id}`,

            entity: "ADVERTISEMENT",
            message: advertisementData.message,
            teamId: advertisementData.teamId,
        })

        return advertisementData;
    }
}

export const dynamooseAdvertisementRepository = new AdvertisementDynamooseRepository();