import React from "react"
import { useTranslation } from "react-i18next"
import { BreadcrumbTitle } from "./breadcrumb"
import { Spinner } from "./SpinnerFluent"
import { AnimatedSection } from "./ui/AnimatedSection"

export default function PageContainer({
  breadcrumb,
  breadcrumbPaths,
  children,
  className = "",
  actions = null,
  bg = true,
  loading = false,
  error = null,
  missing = false,
}) {
  const { t } = useTranslation("common")
  const hasState = loading || error || missing

  return (
    <div className={`min-h-screen w-full ${className}`}>
      {/* Breadcrumb header */}
      {breadcrumb && (
        <div className="bg-[#f3f3f3] sticky top-16 z-10 flex items-center justify-between pt-4 pb-5 px-4 md:px-0 ">
          <div className="flex-1 min-w-0 max-w-[1024px] mx-auto">
            <div className="flex items-center space-x-2 w-max max-w-full">
              <BreadcrumbTitle items={breadcrumb} paths={breadcrumbPaths} />
            </div>
          </div>
          {actions && <div className="ml-4 flex-shrink-0">{actions}</div>}
        </div>
      )}

      {/* State handling */}
      {hasState ? (
        <>
          {loading && (
            <div className="flex items-center justify-center min-h-[70px]">
              <Spinner />
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm leading-5 border border-red-200 rounded-[5px] bg-red-50 flex items-center px-5 min-h-[70px]">
              <div className="text-red-500">
                <p className="font-medium">{t("common.somethingWentWrong")}</p>

                <p className="text-xs leading-4 opacity-80">
                  {typeof error === "string"
                    ? error
                    : error?.data?.errorMessage
                    ? error.data.errorMessage
                    : error?.message
                    ? error.message
                    : t("common.pleaseTryAgain")}
                </p>

                {error?.errorCode && (
                  <p className="text-xs leading-4 opacity-70">
                    Code: {error.errorCode}
                  </p>
                )}
              </div>
            </div>
          )}

          {missing && (
            <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
              {t("common.pageDeletedOrUnavailable")}
            </div>
          )}
        </>
      ) : (
        <div className="max-w-[1024px] mx-auto">{children}</div>
      )}
    </div>
  )
}
