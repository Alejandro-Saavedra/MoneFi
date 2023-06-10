using Google.Apis.AnalyticsReporting.v4.Data;
using MoneFi.Models.Requests.GoogleReportRequest;

namespace MoneFi.Services.Interfaces
{
    public interface IGoogleAnalyticsReportService
    {
        GetReportsResponse GetAnalyticsReport(GoogleGetReportRequest model);
    }
}
