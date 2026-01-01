import axiosClient from './axiosClient';

const submissionApi = {
  //Download submittion by id
  downloadById: (submissionId) =>
    axiosClient.get(`/submissions/${submissionId}/download`),

  //Submit code for auto evaluation
  // If useMockTest is true, uses mock test endpoint
  submitAutoTest: (roundId, data, useMockTest = false) => {
    const endpoint = useMockTest
      ? `/rounds/${roundId}/auto-test/mock-test/submissions`
      : `/rounds/${roundId}/auto-test/submissions`;
    return axiosClient.post(endpoint, data);
  },
  //Submit final auto evaluation
  submitFinalAutoTest: (submissionId) => {
    return axiosClient.put(`/submissions/${submissionId}/acceptance`);
  },
  //Get auto test result
  getAutoTestResult: (roundId) =>
    axiosClient.get(`/rounds/${roundId}/auto-test/my-result`),
  
}

export default submissionApi;
