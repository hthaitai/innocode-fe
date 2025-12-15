import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { Icon } from "@iconify/react";
import quizApi from "@/api/quizApi";

const FinishQuiz = () => {
  const { roundId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Get contestId from location state or params
  const contestId = location.state?.contestId;
  const [myQuiz, setMyQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if result data is passed from submit (from MCQTest.jsx)
    const resultDataFromState = location.state?.resultData;

    if (resultDataFromState) {
      // Use data from submit response directly (no API call needed)
      console.log("✅ Using result data from submit:", resultDataFromState);
      setMyQuiz(resultDataFromState);
      setLoading(false);
      return;
    }

    // Otherwise, fetch from API (for direct navigation to finish page)
    const fetchMyQuiz = async () => {
      try {
        const res = await quizApi.getMyQuiz(roundId);
        // Extract the first attempt from the data array
        const attemptData = res.data?.data?.[0] || res.data?.data || res.data;
        setMyQuiz(attemptData);
        console.log("📥 Fetched quiz result from API:", attemptData);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to fetch result"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMyQuiz();
  }, [roundId, location.state]);

  if (loading) {
    return (
      <PageContainer bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading result...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <Icon
              icon="mdi:alert-circle-outline"
              className="w-20 h-20 text-red-500 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Failed to fetch result
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() =>
                contestId
                  ? navigate(`/contest-detail/${contestId}`)
                  : navigate(`/contests`)
              }
              className="button-orange"
            >
              <Icon icon="mdi:arrow-left" className="inline mr-2" />
              {contestId ? "Back to Contest Detail" : "Back to Contests"}
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  return (
    <PageContainer bg={false}>
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center text-white">
            <Icon
              icon="mdi:check-circle"
              className="w-24 h-24 mx-auto mb-4 drop-shadow-lg"
            />
            <h2 className="text-3xl font-bold mb-2">
              Quiz Completed Successfully!
            </h2>
            <p className="text-green-50 text-lg">
              Congratulations on completing the quiz
            </p>
          </div>

          {/* Quiz Info Section */}
          <div className="p-8">
            {/* Test Name */}
            {myQuiz?.testName && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {myQuiz.testName}
                </h3>
                <p className="text-gray-600">
                  Submitted by {myQuiz.studentName || "Student"}
                </p>
              </div>
            )}

            {/* Score Display */}
            <div className="mb-8">
              <div className="text-center bg-orange-50 rounded-lg p-6 border border-orange-100">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Your Score
                </p>
                <div className="text-6xl font-bold text-orange-500 mb-2">
                  {myQuiz?.score ?? "--"}
                </div>
                {myQuiz?.totalPossibleScore && (
                  <p className="text-gray-500 mb-2">
                    out of {myQuiz.totalPossibleScore} points
                  </p>
                )}
                {myQuiz?.correctAnswers !== undefined &&
                  myQuiz?.totalQuestions && (
                    <p className="text-lg font-semibold text-gray-700">
                      {myQuiz.correctAnswers} / {myQuiz.totalQuestions} correct
                      answers
                      {myQuiz.totalQuestions > 0 && (
                        <span className="text-orange-600 ml-2">
                          (
                          {Math.round(
                            (myQuiz.correctAnswers / myQuiz.totalQuestions) *
                              100
                          )}
                          %)
                        </span>
                      )}
                    </p>
                  )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Start Time - only show if available */}
              {myQuiz?.startTime && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon
                        icon="mdi:clock-start"
                        className="w-6 h-6 text-blue-600"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Start Time
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatDateTime(myQuiz.startTime)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* End Time / Submitted At */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Icon
                      icon="mdi:clock-end"
                      className="w-6 h-6 text-purple-600"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      {myQuiz?.endTime ? "End Time" : "Submitted At"}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatDateTime(myQuiz?.endTime || myQuiz?.submittedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Results - Detail for each question */}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() =>
                  contestId
                    ? navigate(`/contest-detail/${contestId}`)
                    : navigate(`/contests`)
                }
                className="button-orange flex items-center gap2"
              >
                <Icon icon="mdi:arrow-left" className="m-2 w-5 h-5" />
                <div className="mr-2">
                  {contestId ? "Back to Contest Detail" : "Back to Contests"}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default FinishQuiz;
