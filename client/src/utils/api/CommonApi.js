import axios from 'axios';
import { getBaseUrl } from "../baseurls";

export const getToken = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/counters/?depth=3`);
    return response.data.data.results.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

export const tutorialApi = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/tutorial/?depth=3`);
    return response.data.data.results.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

export const packageApi = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/packages/?depth=3`);
    return response.data.data.results.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

export const heroApi = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/banners/?depth=3`);
    return response.data.data.results.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};


export const getExtrafeature = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/extra-features/?depth=3`);
    return response.data.data.results.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

export const getFaq = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/faqs/`);
    return response.data.data.results.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};


export const getBlog = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/blogs/`);
    return response.data.data.results.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

