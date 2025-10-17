import React from "react"
import { motion } from "framer-motion"
import { BreadcrumbTitle } from "./breadcrumb"

export default function PageContainer({
  breadcrumb,
  breadcrumbPaths,
  children,
  className = "",
  actions = null,
  bg = true,
}) {
  // Windows 11 Fluent Design ease-out curve (fast → slow)
  const fluentEaseOut = [0.16, 1, 0.3, 1]

  // Subtle right → left motion for content only
  const slideVariants = {
    hidden: { x: 30 }, // small offset to the right
    enter: {
      x: 0,
      transition: {
        duration: 0.5,
        ease: fluentEaseOut,
      },
    },
  }

  return (
    <div className={`${className}`}>
      {/* Breadcrumb stays static */}
      {breadcrumb && (
        <div className="bg-[#f3f3f3] sticky top-0 z-10 flex items-center justify-between py-5">
          <BreadcrumbTitle items={breadcrumb} paths={breadcrumbPaths} />
          {actions && <div className="ml-4">{actions}</div>}
        </div>
      )}

      {/* Only children have slide animation */}
      <motion.div
        key={breadcrumbPaths?.join("/") || "page"}
        variants={slideVariants}
        initial="hidden"
        animate="enter"
        className={`${bg ? "" : ""} ${breadcrumb ? "" : ""}`}
      >
        {children}
      </motion.div>
    </div>
  )
}
