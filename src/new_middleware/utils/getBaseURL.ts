import { API_PATH } from '../config/apiPath';
import { getServiceRoute, ServiceVariant } from '../config/routes';

export const getServiceBaseURL = (service: ServiceVariant) => {
  return API_PATH + getServiceRoute(service);
};