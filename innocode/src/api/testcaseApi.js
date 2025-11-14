import axiosClient from "./axiosClient";

export const testcaseApi = {
  getRoundTestcases: (roundId) =>
    axiosClient.get(`rounds/${roundId}/test-cases`),
};
export default testcaseApi;