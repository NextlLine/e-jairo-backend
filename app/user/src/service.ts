import { UserRepository } from "../../../domain/user/user.repository";
import { mapToHttpError } from "../../../shared/errors/map-http-error";

export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async getUserById(userId: string) {
        try {
            return await this.userRepository.findById(userId);
        } catch (error) {
            return mapToHttpError(error, "criar time");
        }
    }
}