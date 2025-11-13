import axiosClient from './axiosClient';

const submissionApi = {
  //Download submittion by id
  downloadById: (submissionId) =>
    axiosClient.get(`/submissions/${submissionId}/download`),

  //Submit code for auto evaluation
  submitAutoTest: (roundId, data) => {
    return axiosClient.post(`/rounds/${roundId}/auto-test/submissions`, data);
  },
  //Submit final auto evaluation
  submitFinalAutoTest: (submissionId) => {
    return axiosClient.post(`/submissions/${submissionId}/acceptance`);
  },
  //Get auto test result
  getAutoTestResult: (roundId) =>
    axiosClient.get(`/rounds/${roundId}/auto-test/my-result`),
};

export default submissionApi;
