import { UserRoles } from "../../../domain/types/UserRoles";
import { UserRepository } from "../../../domain/user/user.repository";
import { HttpError } from "../../../shared/errors/http-error";

export async function verifyUserRole(userSub: string, allowedRoles: UserRoles[], userRepository: UserRepository): Promise<void> {
    const user = await userRepository.findById(userSub);

    if (!user) {
        throw new HttpError(404, "Usuário não encontrado");
    }

    if (!allowedRoles.includes(user.role)) {
        throw new HttpError(403, "Usuário não autorizado a realizar esta ação");
    }
}