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
  loading = false,
  error = null,
}) {
  // Fluent design motion curve
  const fluentEaseOut = [0.16, 1, 0.3, 1]

  const slideVariants = {
    hidden: { x: 30 },
    enter: {
      x: 0,
      transition: { duration: 0.5, ease: fluentEaseOut },
    },
  }

  // Fluent-style spinner (soft, glowing orange ring)
  const Spinner = () => (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  )

  const hasState = loading || error

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Breadcrumb header */}
      {breadcrumb && (
        <div className="bg-[#f3f3f3] sticky top-0 z-10 flex items-center justify-between pt-4 pb-6">
          <div className="flex-1 overflow-x-auto">
            <div className="flex items-center space-x-2 w-max">
              <BreadcrumbTitle items={breadcrumb} paths={breadcrumbPaths} />
            </div>
          </div>
          {actions && <div className="ml-4 flex-shrink-0">{actions}</div>}
        </div>
      )}

      {/* State handling */}
      {hasState ? (
        <div className="flex items-center justify-center h-[300px]">
          {loading && <Spinner />}
          {error && (
            <div className="text-red-500 text-center px-4">
              <p className="font-medium">Something went wrong</p>
              <p className="text-sm opacity-80 mt-1">
                {typeof error === "string" ? error : "Please try again later."}
              </p>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          key={breadcrumbPaths?.join("/") || "page"}
          variants={slideVariants}
          initial="hidden"
          animate="enter"
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}
