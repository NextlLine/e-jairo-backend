import { Advertisement } from "./advertisement.entity";

export interface AdvertisementRepository {
    create(advertisementData: Advertisement): Promise<Advertisement>;
    listByTeam(teamId: string): Promise<Advertisement[]>;
}