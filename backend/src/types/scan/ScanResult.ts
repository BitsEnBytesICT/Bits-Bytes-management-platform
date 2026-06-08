export interface ScanResult {
    success: boolean;
    action: string;
    message: string;
    user?: {
        name: string;
        department: string;
    };
}
