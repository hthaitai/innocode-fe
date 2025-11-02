import React from "react"
import PageContainer from '@/shared/components/PageContainer'
import { useOrganizerBreadcrumb } from '@/features/organizer/hooks/useOrganizerBreadcrumb'
import CertificateTemplatesTable from "../../components/organizer/CertificateTemplatesTable"
import CertificatesTable from "../../components/organizer/CertificatesTable"

const OrganizerCertificates = () => {
  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_CERTIFICATES")

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
    >
      <div className="space-y-5">
        <CertificateTemplatesTable />

        <div>
          <div className="text-sm font-semibold pt-3 pb-2">Issued certificates</div>
          <CertificatesTable />
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerCertificates
