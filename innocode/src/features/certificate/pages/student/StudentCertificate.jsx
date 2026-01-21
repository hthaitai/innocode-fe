import React from "react"
import { useTranslation } from "react-i18next"
import PageContainer from "../../../../shared/components/PageContainer"
import { BREADCRUMBS } from "../../../../config/breadcrumbs"
import { useGetMyCertificatesQuery } from "../../../../services/certificateApi"
import { useEffect, useMemo } from "react"
import { useLocation } from "react-router-dom"
import { Download } from "lucide-react"

// Format date based on current language
const formatDateByLanguage = (iso, language) => {
  if (!iso) return ""
  try {
    const locale = language === "vi" ? "vi-VN" : "en-US"
    return new Date(iso).toLocaleDateString(locale, {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (e) {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
}

const handleDownload = async (url, filename) => {
  const res = await fetch(url)
  const blob = await res.blob()
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename || "certificate.png"
  link.click()
  URL.revokeObjectURL(link.href)
}

function StudentCertificate() {
  const { t, i18n } = useTranslation("pages")
  const location = useLocation()
  const { data: certificates, isLoading, error } = useGetMyCertificatesQuery()

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )

  const breadcrumb = [
    i18n.language === "vi" ? "Chứng chỉ học sinh" : "Student Certificate",
  ]

  useEffect(() => {
    const certId = queryParams.get("id")
    if (certificates && certId) {
      setTimeout(() => {
        const element = document.getElementById(`cert-${certId}`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
          element.classList.add("ring-2", "ring-primary-500", "ring-offset-2")
          setTimeout(() => {
            element.classList.remove(
              "ring-2",
              "ring-primary-500",
              "ring-offset-2",
            )
          }, 3000)
        }
      }, 500)
    }
  }, [certificates, queryParams])

  if (isLoading) {
    return (
      <PageContainer breadcrumb={breadcrumb}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              {t("certificate.loadingCertificates")}
            </p>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.STUDENT_CERTIFICATE}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center text-red-500">
            {typeof error === "string"
              ? error
              : error?.data?.errorMessage ||
                error?.message ||
                t("common.somethingWentWrong")}
          </div>
        </div>
      </PageContainer>
    )
  }

  const certificateList = certificates?.data || certificates || []

  if (certificateList.length === 0) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.STUDENT_CERTIFICATE}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center text-gray-500">
            {t("certificate.noCertificatesIssued")}
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer breadcrumb={BREADCRUMBS.STUDENT_CERTIFICATE}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h3 className="text-3xl font-semi-bold text-gray-900 mb-2">
              {t("certificate.youHaveEarned", {
                count: certificateList.length,
                plural: certificateList.length !== 1 ? "s" : "",
              })}
            </h3>
          </div>

          {/* Certificate Grid (horizontal cards) */}
          <div className="flex flex-wrap gap-6">
            {certificateList.map((certificate) => (
              <div
                key={certificate.certificateId}
                id={`cert-${certificate.certificateId}`}
                className="w-full bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row"
              >
                {/* Image (left on md+, top on mobile) */}
                <div className="md:w-56 w-full h-44 md:h-auto bg-gray-200 overflow-hidden flex-shrink-0">
                  <img
                    src={certificate.fileUrl}
                    alt={`${t("certificate.certificate")} - ${
                      certificate.templateName
                    }`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info (right on md+, bottom on mobile) */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {certificate.templateName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {t("certificate.by")}{" "}
                      <span className="font-medium">
                        {certificate.studentName}
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                      {(certificate.teamName || certificate.team?.name) && (
                        <div>
                          <p className="text-xs text-gray-500">
                            {t("certificate.team")}
                          </p>
                          <p className="text-gray-900 font-medium">
                            {certificate.teamName || certificate.team?.name}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-gray-500">
                          {t("certificate.issued")}
                        </p>
                        <p className="text-gray-900 font-medium">
                          {formatDateByLanguage(
                            certificate.issuedAt,
                            i18n.language,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <a
                      href={certificate.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      {t("certificate.viewCertificate")}
                    </a>
                    <button
                      onClick={() =>
                        handleDownload(
                          certificate.fileUrl,
                          certificate.templateName + ".png",
                        )
                      }
                      className="flex-1 cursor-pointer flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-500 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      <Download size={16} />{" "}
                      {t("certificate.downloadCertificate")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default StudentCertificate
