import { testcaseApi } from '../../../api/testcaseApi';

const autoProblemService = {
  async getTestCases() {
    const { data } = await testcaseApi.getRoundTestcases();

    return data;
  },
};

export default autoProblemService;
