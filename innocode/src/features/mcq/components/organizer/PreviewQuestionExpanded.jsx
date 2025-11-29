import { AnimatePresence, motion } from "framer-motion"

const PreviewQuestionExpanded = ({ question }) => {
  const options = question?.options || []

  return (
    <div>
      {options.map((opt, i) => {
        const label = String.fromCharCode(65 + i)
        return (
          <div
            key={opt.optionId || i}
            className="flex flex-nowrap items-center gap-3 py-[6px] text-sm leading-5 whitespace-nowrap"
          >
            <span className="font-medium">{label}.</span>
            <span className="whitespace-nowrap">{opt.text}</span>
            {opt.isCorrect ? (
              <span className="text-green-600 font-medium whitespace-nowrap">
                Correct
              </span>
            ) : (
              <span className="text-gray-400 whitespace-nowrap">Incorrect</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PreviewQuestionExpanded
