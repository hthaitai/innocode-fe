import axiosClient from "./axiosClient";

const quizApi = {
  //Get quiz for round
  getQuiz: (roundId) => axiosClient.get(`/rounds/${roundId}/mcq-test`),
  //Submit quiz answers
  submitQuiz: (roundId, data) =>
    axiosClient.post(`/rounds/${roundId}/mcq-test/submit`, data),
  //Get my quizzes
  getMyQuiz: (roundId) =>
    axiosClient.get(`/rounds/${roundId}/attempts/my-attempt`),
};

export default quizApi;
