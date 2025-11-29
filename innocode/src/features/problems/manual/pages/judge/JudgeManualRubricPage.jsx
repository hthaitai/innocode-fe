import React from "react";
import { useParams } from "react-router-dom";

const JudgeManualRubricPage = () => {
  const { submissionId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manual Rubric</h1>
      <p>Rubric for submission ID: <strong>{submissionId}</strong> will appear here for scoring.</p>
    </div>
  );
};

export default JudgeManualRubricPage;
