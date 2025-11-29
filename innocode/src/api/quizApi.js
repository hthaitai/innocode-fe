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
  //Get start quiz
  getStartDetail: (roundId) =>
    axiosClient.get(`/rounds/${roundId}/mcq-test/start-detail`),
  //Save quiz answers
  saveAnswers: (roundId, key, answer) =>
    axiosClient.post(
      `/rounds/${roundId}/mcq-test/save-answer?key=${key}`,
      answer
    ),
  //Get current answer
  getCurrentAnswer: (roundId, key) =>
    axiosClient.get(`/rounds/${roundId}/mcq-test/current-answer?key=${key}`),
};

export default quizApi;
