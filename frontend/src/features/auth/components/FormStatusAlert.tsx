import { Alert } from "@/components/ui/Alert";
import type { FormStatus } from "../types";

type FormStatusAlertProps = {
    status: FormStatus;
};

export function FormStatusAlert({ status }: FormStatusAlertProps) {
    if (!status.message || status.tone === "idle") {
        return null;
    }

    return <Alert tone={status.tone}>{status.message}</Alert>;
}
