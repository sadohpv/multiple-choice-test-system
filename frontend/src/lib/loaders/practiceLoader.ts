import { apiService } from "@/services/apiService";
import { useSubjectsStore } from "../store/subjects.store";

export const practiceLoader = async () => {
    const subjects = await apiService.fetchAllSubject();
    useSubjectsStore.getState().setListSubject(subjects);
};

export const shouldRevalidateAuth = () => {
    return false;
};
