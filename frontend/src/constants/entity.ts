export interface ISubjectEntity {
    id: string;
    name: string;
    slug: string;
    createdAt: number;
    questionCount?: number;
    examCodeCount?: number;
<<<<<<< HEAD
}

export interface RoleEntity {
    id: number;
    roleName: string;
    description?: string | null;
    roleLevel?: number | null;
    createdAt?: number | null;
    updatedAt?: number | null;
=======
>>>>>>> 681270c2958d931e2775a73de7e61076aa1203a4
}
