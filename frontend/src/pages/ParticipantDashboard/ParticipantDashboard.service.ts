import http from "../../common/http";

export default class ParticipantDashboardService {
    isVerified = async () => {
        return (await http("/api/verify", "POST")).status;
    };
}
