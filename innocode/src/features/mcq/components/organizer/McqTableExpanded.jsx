import { AnimatePresence, motion } from "framer-motion"

const McqTableExpanded = ({ mcq = {} }) => {
  const options = mcq.options || mcq.choices || []

  return (
    <div>
      {options.map((opt, i) => {
        const label = String.fromCharCode(65 + i)
        const text = opt.text || opt.content || opt.value || "No text"
        const isCorrect = opt.isCorrect || opt.is_correct || opt.correct

        return (
          <div
            key={opt.optionId || opt.id || i}
            className="flex flex-nowrap items-center gap-3 py-[6px] text-sm leading-5 whitespace-nowrap"
          >
            <span className="font-medium">{label}.</span>
            <span className="whitespace-nowrap">{text}</span>
            {isCorrect ? (
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

export default McqTableExpanded
