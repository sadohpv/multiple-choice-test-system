import type { SubjectEntity } from "@/constants/entity";
import { create } from "zustand";

interface SubjectsState {
    subjects: SubjectEntity[];
    loading: boolean;
    error: string | null;

    clearSubjects: () => void;
    getAllSubjects: () => SubjectEntity[] | undefined;
    setListSubject: (list: SubjectEntity[]) => void;
}

export const useSubjectsStore = create<SubjectsState>((set, get) => ({
    subjects: [],
    loading: false,
    error: null,

    clearSubjects: () => set({ subjects: [] }),
    setListSubject: (list: SubjectEntity[]) => set({ subjects: list }),
    getAllSubjects: () => {
        return get().subjects;
    },
}));
