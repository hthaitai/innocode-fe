import React from 'react'
import TextFieldFluent from '../../../../../shared/components/TextFieldFluent'

const McqTestConfigFields = ({ mcqTestConfig, handleNestedChange }) => {
  return (
    <div className='space-y-3'>
      <TextFieldFluent
        label="Config Name"
        value={mcqTestConfig?.name || ""}
        onChange={(e) => handleNestedChange("mcqTestConfig", "name", e.target.value)}
      />
      <TextFieldFluent
        label="Config"
        value={mcqTestConfig?.config || ""}
        onChange={(e) => handleNestedChange("mcqTestConfig", "config", e.target.value)}
      />
    </div>
  )
}

export default McqTestConfigFields