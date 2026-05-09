export interface ISubjectEntity {
    id: string;
    name: string;
    slug: string;
    createdAt: number;
    questionCount?: number;
    examCodeCount?: number;
}
