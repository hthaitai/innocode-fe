const PreviewQuestionExpanded = ({ question }) => {
  const options = question?.options || []

  return (
    <div className="flex flex-col gap-1">
      {options.map((opt, i) => {
        const label = String.fromCharCode(65 + i)
        const text = opt.text || "No text"
        const isCorrect = opt.isCorrect

        return (
          <div
            key={opt.optionId || i}
            className={`flex items-center gap-2 text-sm leading-5 px-5 pl-24.5 py-1 ${
              isCorrect ? "bg-green-50" : ""
            }`}
          >
            <span className="font-medium">{label}.</span>
            <span>{text}</span>
          </div>
        )
      })}
    </div>
  )
}

export default PreviewQuestionExpanded
