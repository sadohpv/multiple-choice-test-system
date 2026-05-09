export interface ISubjectEntity {
    id: string;
    subjectName: string;
    slug: string;
    createdAt: number;
}

export interface RoleEntity {
    id: number;
    roleName: string;
    description?: string | null;
    roleLevel?: number | null;
    createdAt?: number | null;
    updatedAt?: number | null;
}
