const McqTableExpanded = ({ mcq = {} }) => {
  const options = mcq.options || mcq.choices || []

  return (
    <div className="flex flex-col gap-1">
      {options.map((opt, i) => {
        const label = String.fromCharCode(65 + i)
        const text = opt.text || opt.content || opt.value || "No text"
        const isCorrect = opt.isCorrect || opt.is_correct || opt.correct

        return (
          <div
            key={opt.optionId || opt.id || i}
            className={`flex items-center gap-2 text-sm leading-5 px-5 pl-11 py-1 rounded ${
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

export default McqTableExpanded
