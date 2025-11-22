import axiosClient from './axiosClient';

const quizApi = {
  //Get quiz for round
  getQuiz: (roundId) => axiosClient.get(`/quizzes/rounds/${roundId}/quiz`),
  //Submit quiz answers
  submitQuiz: (roundId, data) =>
    axiosClient.post(`/quizzes/${roundId}/submit`, data),
  //Get my quizzes
  getMyQuiz: (roundId) => axiosClient.get(`/quizzes/${roundId}/attempts/me`),
};

export default quizApi;
