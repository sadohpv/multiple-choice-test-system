import type { RoleEntity } from "@/constants/entity";
import { apiService } from "@/services/apiService";
import { useRolesStore } from "../store/roles.store";

export const rolesLoader = async () => {
    const roles = await apiService.get<RoleEntity[]>("/roles");
    useRolesStore.getState().setRoles(roles);
    return null;
};
