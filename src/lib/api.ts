import axios from "axios";

const API_URL = "https://api.xbase.app/api";

export const getFlows = async () => {
  const { data } = await axios.get(`${API_URL}/flows`);
  return data;
};

export const getFlowById = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/flows/${id}`);
  return data;
}; 