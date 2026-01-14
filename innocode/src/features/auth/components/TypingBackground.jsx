import React from "react"

const TypingBackground = ({ typedText, subtitle }) => {
  return (
    <div className="flex-1 bg-gradient-to-br from-[#ff6b35] via-[#f7931e] to-[#ffd89b] flex items-center justify-center p-8 relative overflow-hidden animate-slideInRight before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)] before:animate-backgroundPulse">
      <div className="relative z-10 text-center max-w-[600px]">
        <h1 className="text-[3.5rem] md:text-[2.5rem] font-bold text-white mb-4 font-sans leading-tight min-h-[90px] md:min-h-[70px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)] break-words inline-block text-center">
          {typedText}
          <span className="font-light animate-blink">|</span>
        </h1>
        <p className="text-xl md:text-base text-white font-normal font-sans mt-4 animate-fadeInUp">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default TypingBackground
