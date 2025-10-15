import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../components/PageContainer";
import { contestsData } from "../../data/contestsData";
import { createBreadcrumbWithPaths, BREADCRUMBS } from "../../config/breadcrumbs";
import Quiz from "../../components/quiz/Quiz";
import { quizQuestions, quizConfig } from "../../data/quizData";

const ContestProcessing = () => {
  const { contestId } = useParams();
  const contest = contestsData.find((c) => c.id === parseInt(contestId));
  const [contestEnded, setContestEnded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 phút tổng cộng
  
  const breadcrumbData = contest
    ? createBreadcrumbWithPaths("CONTEST_PROCESSING", contestId)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ["/"] };

  // Ngăn chặn điều hướng khi contest đang diễn ra
  useEffect(() => {
    if (contest) {
      // Sử dụng setTimeout để đảm bảo breadcrumb đã render
      const disableNavigation = () => {
        // Ngăn chặn breadcrumb spans (không phải a tags)
        const breadcrumbSpans = document.querySelectorAll(
          ".breadcrumb-fixed span"
        );
        breadcrumbSpans.forEach((span) => {
          span.classList.add('contest-disabled');
        });

        // Ngăn chặn click vào navbar links
        const navbarLinks = document.querySelectorAll(".navbar-menu a");
        navbarLinks.forEach((link) => {
          link.style.pointerEvents = "none";
          link.style.cursor = "not-allowed";
          link.style.opacity = "0.6";
        });

        // Ngăn chặn click vào sidebar links
        const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
        sidebarLinks.forEach((link) => {
          link.style.pointerEvents = "none";
          link.style.cursor = "not-allowed";
          link.style.opacity = "0.6";
        });

        // Ngăn chặn click vào logo
        const logoLink = document.querySelector(".logo-link");
        if (logoLink) {
          logoLink.style.pointerEvents = "none";
          logoLink.style.cursor = "not-allowed";
          logoLink.style.opacity = "0.6";
        }
      };

      // Khôi phục navigation
      const restoreNavigation = () => {
        // Khôi phục breadcrumb spans
        const breadcrumbSpans = document.querySelectorAll(
          ".breadcrumb-fixed span"
        );
        breadcrumbSpans.forEach((span) => {
          span.classList.remove('contest-disabled');
        });

        // Khôi phục navbar links
        const navbarLinks = document.querySelectorAll(".navbar-menu a");
        navbarLinks.forEach((link) => {
          link.style.pointerEvents = "auto";
          link.style.cursor = "pointer";
          link.style.opacity = "1";
        });

        // Khôi phục sidebar links
        const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
        sidebarLinks.forEach((link) => {
          link.style.pointerEvents = "auto";
          link.style.cursor = "pointer";
          link.style.opacity = "1";
        });

        // Khôi phục logo link
        const logoLink = document.querySelector(".logo-link");
        if (logoLink) {
          logoLink.style.pointerEvents = "auto";
          logoLink.style.cursor = "pointer";
          logoLink.style.opacity = "1";
        }
      };

      // Ngăn chặn browser back/forward
      const handlePopState = (e) => {
        e.preventDefault();
        window.history.pushState(null, "", window.location.href);
      };

      if (!contestEnded && !quizCompleted) {
        // Contest đang diễn ra và chưa nộp bài - disable navigation
        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        // Chạy ngay lập tức và sau 100ms để đảm bảo breadcrumb đã render
        disableNavigation();
        const timeoutId = setTimeout(disableNavigation, 100);

        // Cleanup function
        return () => {
          clearTimeout(timeoutId);
          window.removeEventListener("popstate", handlePopState);
        };
      } else {
        // Contest đã kết thúc hoặc đã nộp bài - restore navigation
        restoreNavigation();
        window.removeEventListener("popstate", handlePopState);
      }
    }
  }, [contest, contestEnded, quizCompleted]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizCompleted]);

  // Quiz handlers
  const handleAnswer = (questionId, selectedOption) => {
    setUserAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(answer => answer.questionId === questionId);
      const newAnswer = {
        questionId: questionId,
        selectedOption: selectedOption,
        isCorrect: selectedOption.isCorrect,
        timestamp: new Date().toISOString()
      };
      
      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = newAnswer;
        return updatedAnswers;
      } else {
        return [...prev, newAnswer];
      }
    });
  };

  const handleSubmitQuiz = () => {
    setQuizCompleted(true);
    // TODO: Submit to API
    console.log('Quiz submitted:', userAnswers);
  };

  const handleQuestionChange = (newIndex) => {
    if (newIndex >= 0 && newIndex < quizQuestions.length) {
      setCurrentQuestionIndex(newIndex);
    }
  };

  const calculateScore = () => {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    return Math.round((correctAnswers / quizQuestions.length) * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      bg={false}
    >
      <div className="page-container">
        {contest ? (
          <div className="flex gap-4">
            <div className="flex-1">
              {/* Quiz Interface */}
              {!quizCompleted ? (
                <Quiz
                  questions={quizQuestions}
                  currentQuestionIndex={currentQuestionIndex}
                  userAnswers={userAnswers}
                  timeLeft={timeLeft}
                  onAnswer={handleAnswer}
                  onSubmit={handleSubmitQuiz}
                  onQuestionChange={handleQuestionChange}
                />
              ) : (
                <div className="bg-gradient-to-br from-green-500 to-green-600 h-[280px] rounded-lg">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <h1 className="text-4xl font-bold mb-4">
                        Hoàn thành!
                      </h1>
                      <p className="text-xl mb-6">
                        Điểm số: {calculateScore()}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

             
   
            
            </div>
          </div>
        ) : (
          <p>Contest not found</p>
        )}
      </div>
    </PageContainer>
  );
};

export default ContestProcessing;
