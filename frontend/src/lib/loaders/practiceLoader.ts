import { apiService } from "@/services/apiService";

export const practiceLoader = async () => {
    const subjects = await apiService.fetchAllSubject();
    console.log("subjects: ", subjects);
};

export const shouldRevalidateAuth = () => {
    return false;
};
