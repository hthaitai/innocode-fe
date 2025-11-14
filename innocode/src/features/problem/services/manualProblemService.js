import axiosClient from '@/api/axiosClient';

const manualProblemService = {
  submitSolution: async (roundId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post(
      `/rounds/${roundId}/manual-test/submissions`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },
};

export default manualProblemService;
