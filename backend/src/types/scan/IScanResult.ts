export default interface IScanResult {
    success: boolean;
    action: string;
    message: string;
    user?: {
        name: string;
        department: string;
    };
}
