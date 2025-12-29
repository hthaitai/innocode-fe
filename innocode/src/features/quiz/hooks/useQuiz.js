import { useGetRoundMcqsQuery } from "@/services/mcqApi";

const useQuiz = (roundId) => {
  // Get openCode from sessionStorage
  const openCode = roundId ? sessionStorage.getItem(`openCode_${roundId}`) : null;
  
  const {
    data: response,
    isLoading: loading,
    error: rtkError,
  } = useGetRoundMcqsQuery(
    {
      roundId,
      pageNumber: 1,
      pageSize: 1000, // Get all questions
      openCode,
    },
    {
      skip: !roundId,
    }
  );

  // Extract quiz data from RTK Query response
  const quiz = response?.data || null;
  const error = rtkError
    ? rtkError?.data?.errorMessage ||
      rtkError?.data?.message ||
      rtkError?.message ||
      "Failed to load quiz"
    : null;

  return { quiz, loading, error };
};

export default useQuiz;
