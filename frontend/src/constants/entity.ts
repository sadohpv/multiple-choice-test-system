export interface ISubjectEntity {
    id: string;
    subjectName: string;
    slug: string;
    createdAt: number;
    questionCount?: number;
    examCodeCount?: number;
}
