import React from "react"
import { BreadcrumbTitle } from "./breadcrumb"

export default function PageContainer({
  breadcrumb,
  breadcrumbPaths, // Thêm prop mới cho paths
  children,
  className = "",
  actions = null,
  bg = true,
}) {
  return (
    <div className={`${className}`}>
      <div className="">
        {breadcrumb && (
          <div className="bg-[#f3f3f3] sticky top-0 z-10 flex items-center justify-between py-5">
            {breadcrumb ? (
              <BreadcrumbTitle items={breadcrumb} paths={breadcrumbPaths} />
            ) : (
              <h1>{title}</h1>
            )}
            {actions && <div className="ml-4">{actions}</div>}
          </div>
        )}
        <div
          className={` ${
            bg ? "" : ""
          } ${breadcrumb ? "" : ""}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
