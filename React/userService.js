import axios from "axios";

const updateEmail = (payload) =>{
  const config = {
    method: "PUT",
    url: `${endpoint}/emailUpdate/${payload.id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const updatePassword = (payload) =>{
  const config = {
    method: "PUT",
    url: `${endpoint}/passwordUpdate/${payload.id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export { updateEmail, updatePassword };
