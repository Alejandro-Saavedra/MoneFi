import axios from 'axios';
import * as helper from '../services/serviceHelpers';

const endpoint = `${helper.API_HOST_PREFIX}/api/analytics`;

const getAnalytics = (payload, startDate, endDate) => {
    const config = {
        method: 'POST',
        url: `${endpoint}/data?startDate=${startDate}&endDate=${endDate}`,
        data: payload,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config)
    .then(helper.onGlobalSuccess)
    .catch(helper.onGlobalError);
};

export { getAnalytics };