import type { RoleEntity } from "@/constants/entity";
import { create } from "zustand";

type RolesUpdater = RoleEntity[] | ((roles: RoleEntity[]) => RoleEntity[]);

interface RolesState {
    roles: RoleEntity[];
    setRoles: (roles: RolesUpdater) => void;
    clearRoles: () => void;
}

export const useRolesStore = create<RolesState>((set) => ({
    roles: [],
    setRoles: (roles) =>
        set((state) => ({
            roles: typeof roles === "function" ? roles(state.roles) : roles,
        })),
    clearRoles: () => set({ roles: [] }),
}));
