import { useState, useEffect } from "react";
import quizApi from "@/api/quizApi";

const useQuiz = (roundId) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!roundId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        // Get openCode from sessionStorage
        const openCode = sessionStorage.getItem(`openCode_${roundId}`);
        const response = await quizApi.getQuiz(roundId, openCode);
        console.log("✅ Quiz API Response:", response);

        // axiosClient returns response.data directly
        if (response.data && response.data.code === "SUCCESS") {
          setQuiz(response.data.data);
        } else {
          setError(response.data?.message || "Failed to load quiz");
        }
      } catch (error) {
        console.error("❌ Error fetching quiz:", error);
        setError(
          error.response?.data?.errorMessage ||
            error.errorMessage ||
            "Failed to load quiz"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [roundId]);
  return { quiz, loading, error };
};
export default useQuiz;
