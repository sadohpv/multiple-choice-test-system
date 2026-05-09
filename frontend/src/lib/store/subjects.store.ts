import type { ISubjectEntity } from "@/constants/entity";
import { create } from "zustand";

interface SubjectsState {
    subjects: ISubjectEntity[];
    loading: boolean;
    error: string | null;

    clearSubjects: () => void;
    getAllSubjects: () => ISubjectEntity[] | undefined;
    setListSubject: (list: ISubjectEntity[]) => void;
}

export const useSubjectsStore = create<SubjectsState>((set, get) => ({
    subjects: [],
    loading: false,
    error: null,

    clearSubjects: () => set({ subjects: [] }),
    setListSubject: (list: ISubjectEntity[]) => set({ subjects: list }),
    getAllSubjects: () => {
        return get().subjects;
    },
}));
