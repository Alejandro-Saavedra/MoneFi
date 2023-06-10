using Google.Apis.AnalyticsReporting.v4;
using Google.Apis.AnalyticsReporting.v4.Data;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Http;
using Google.Apis.Services;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using MoneFi.Models.AppSettings;
using MoneFi.Models.Domain;
using MoneFi.Models.Requests.GoogleReportRequest;
using MoneFi.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoneFi.Services
{
    public class GoogleAnalyticsReportService : IGoogleAnalyticsReportService
    {
        private PersonalServiceAccountCred _gaKey;
        private GoogleCredential _credential;
        private AnalyticsReportingService _client;
        private AnalyticsViewID _viewID;

        public GoogleAnalyticsReportService(IOptions<PersonalServiceAccountCred> gaKey, IOptions<AnalyticsViewID> viewID)
        {
            _viewID = viewID.Value;
            _gaKey = gaKey.Value;

            _credential = GoogleCredential.FromJson(JsonConvert.SerializeObject(_gaKey))
                    .CreateScoped(new[] { AnalyticsReportingService.Scope.AnalyticsReadonly });
            _client = new AnalyticsReportingService(

                new BaseClientService.Initializer
                {
                    HttpClientInitializer = _credential
                }
                );

        }

        public GetReportsResponse GetAnalyticsReport(GoogleGetReportRequest model)
        {
            string viewId = _viewID.ViewID;

            ReportRequest reportRequest = new ReportRequest
            {
                ViewId = viewId,
                DateRanges = new List<DateRange>
                {
                    new DateRange
                    {
                        StartDate = model.StartDate,
                        EndDate = model.EndDate,
                    }
                },
                Dimensions = model.Dimensions,
                Metrics = model.Metrics,
                OrderBys = model.OrderBy,
            };

            List<ReportRequest> requests = new List<ReportRequest>();
            requests.Add(reportRequest);

            GetReportsRequest getReport = new GetReportsRequest() { ReportRequests = requests };
            GetReportsResponse response = _client.Reports.BatchGet(getReport).Execute();

            return response;
        }
    }
}
