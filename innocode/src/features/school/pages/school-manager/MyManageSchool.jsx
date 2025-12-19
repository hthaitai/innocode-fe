import React from 'react'
import PageContainer from '../../../../shared/components/PageContainer'
import { BREADCRUMBS } from '../../../../config/breadcrumbs'

const MyManageSchool = () => {
  return (
    <PageContainer
      breadcrumb={BREADCRUMBS.SCHOOL_MANAGEMENT}
    >
      <div>MyManageSchool</div>
    </PageContainer>
  )
}

export default MyManageSchool