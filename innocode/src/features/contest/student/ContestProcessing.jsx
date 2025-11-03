import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { contestsData } from "@/data/contestsData";
import { createBreadcrumbWithPaths, BREADCRUMBS } from "@/config/breadcrumbs";
import { Icon } from "@iconify/react";

// Sample MCQS data - Thay thế bằng data từ API sau
const sampleQuestions = [
  {
    id: 1,
    question:
      "What is the output of the following code?\n\n```python\nprint(2 ** 3)\n```",
    options: [
      { id: "a", text: "6" },
      { id: "b", text: "8" },
      { id: "c", text: "9" },
      { id: "d", text: "23" },
    ],
    correctAnswer: "b",
  },
  {
    id: 2,
    question: "Which data structure uses LIFO (Last In First Out) principle?",
    options: [
      { id: "a", text: "Queue" },
      { id: "b", text: "Array" },
      { id: "c", text: "Stack" },
      { id: "d", text: "Linked List" },
    ],
    correctAnswer: "c",
  },
  {
    id: 3,
    question: "What is the time complexity of binary search?",
    options: [
      { id: "a", text: "O(n)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n²)" },
      { id: "d", text: "O(1)" },
    ],
    correctAnswer: "b",
  },
];

const ContestProcessing = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const contest = contestsData.find((c) => c.id === parseInt(contestId));

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breadcrumbData = contest
    ? createBreadcrumbWithPaths("CONTEST_PROCESSING", contestId)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ["/"] };

  if (!contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData.items}
        breadcrumbPaths={breadcrumbData.paths}
      >
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Contest not found</p>
        </div>
      </PageContainer>
    );
  }

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    if (window.confirm("Are you sure you want to submit your answers?")) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Submitted answers:", answers);
        alert("Contest submitted successfully!");
        navigate(`/contest-detail/${contestId}`);
      }, 1000);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const question = sampleQuestions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / sampleQuestions.length) * 100;

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      bg={false}
    >
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col">
          <div className=" border-b border-gray-200 sticky">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    {contest.name}
                    Contest Name
                  </h1>
                  Question {currentQuestion + 1} of {sampleQuestions.length}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Time Remaining</p>
                    <p className="text-xl font-bold text-red-600">
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Contest"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Main Content */}
              <div className="col-span-9">
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  {/* Question */}
                  <div className="mb-8">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {currentQuestion + 1}
                      </span>
                      <div className="flex-1">
                        <pre className="whitespace-pre-wrap font-sans text-lg text-gray-900">
                          {question.question}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label
                        key={option.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          answers[question.id] === option.id
                            ? "border-orange-300 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option.id}
                            checked={answers[question.id] === option.id}
                            onChange={() =>
                              handleAnswerSelect(question.id, option.id)
                            }
                            className="w-5 h-5 text-orange-600 cursor-pointer"
                          />
                          <span className="flex items-center gap-2">
                            <span className="font-semibold">
                              {option.id.toUpperCase()}.
                            </span>
                            <span className="">{option.text}</span>
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                      className="flex items-center gap-2 cursor-pointer px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icon icon="lucide:chevron-left" className="w-5 h-5" />
                      Previous
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={currentQuestion === sampleQuestions.length - 1}
                      className="flex items-center cursor-pointer gap-2 px-6 py-2  bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <Icon icon="lucide:chevron-right" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-span-3">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {answeredCount}/{sampleQuestions.length}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Navigator */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Questions
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {sampleQuestions.map((q, index) => (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestion(index)}
                          className={`aspect-square rounded-lg cursor-pointer text-sm font-semibold transition-all ${
                            index === currentQuestion
                              ? "bg-orange-500 text-white"
                              : answers[q.id]
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span className="text-gray-600">Current</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                        <span className="text-gray-600">Answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                        <span className="text-gray-600">Not Answered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ContestProcessing;
