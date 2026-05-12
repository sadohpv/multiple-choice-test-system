export interface ISubjectEntity {
    id: string;
    name: string;
    slug: string;
    createdAt: number;
    questionCount?: number;
    examCodeCount?: number;
}

export interface RoleEntity {
    id: number;
    roleName: string;
    description?: string | null;
    roleLevel?: number | null;
    createdAt?: number | null;
    updatedAt?: number | null;
}
