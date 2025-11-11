import axiosClient from './axiosClient';

const quizApi = {
  //Get quiz for round
  getQuiz: (roundId) => axiosClient.get(`/quizzes/rounds/${roundId}/quiz`),
  //Submit quiz answers
  submitQuiz: (roundId, data) =>
    axiosClient.post(`/quizzes/${roundId}/submit`, data),
};
export default quizApi;