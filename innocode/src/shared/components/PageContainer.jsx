import React from "react"
import { BreadcrumbTitle } from "./breadcrumb"
import { Spinner } from "./SpinnerFluent"

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
  const hasState = loading || error

  return (
    <div className={`min-h-screen w-full ${className}`}>
      {/* Breadcrumb header */}
      {breadcrumb && (
        <div className="bg-[#f3f3f3] sticky top-0 z-10 flex items-center justify-between pt-4 pb-6 px-4 md:px-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 w-max max-w-full">
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
                {typeof error === "string"
                  ? error
                  : error?.data?.errorMessage
                  ? error.data.errorMessage
                  : error?.message
                  ? error.message
                  : "Please try again later."}
              </p>

              {error?.errorCode && (
                <p className="text-xs opacity-70 mt-1">
                  Code: {error.errorCode}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full">{children}</div>
      )}
    </div>
  )
}
