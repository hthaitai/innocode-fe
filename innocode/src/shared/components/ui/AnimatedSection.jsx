import React from "react"
import { motion } from "framer-motion"

const fluentEaseOut = [0.16, 1, 0.3, 1]

export const AnimatedSection = ({ children }) => {
  const slideVariants = {
    hidden: { x: 30, opacity: 0 },
    enter: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: fluentEaseOut },
    },
  }

  return (
    <motion.div
      variants={slideVariants}
      initial="hidden"
      animate="enter"
      className="w-full"
    >
      {children}
    </motion.div>
  )
}
