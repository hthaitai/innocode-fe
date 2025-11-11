import { useState } from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"

const NewTestCaseForm = ({ onCreate, loading }) => {
  const [form, setForm] = useState({
    description: "",
    input: "",
    expectedOutput: "",
    weight: 1,
    timeLimitMs: null,
    memoryKb: null,
  })

  const updateForm = (field) => (e) => {
    const value = e.target.value
    setForm((prev) => ({
      ...prev,
      [field]: field === "weight" || field === "timeLimitMs" || field === "memoryKb"
        ? (value ? Number(value) : null)
        : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description.trim() || !form.input.trim() || !form.expectedOutput.trim()) return
    await onCreate(form)
    setForm({ description: "", input: "", expectedOutput: "", weight: 1, timeLimitMs: null, memoryKb: null })
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#E5E5E5] rounded-[5px] bg-white p-4 flex flex-col gap-4">
      <p className="text-sm text-[#7A7574]">Add New Test Case</p>

      {/* Description */}
      <TextFieldFluent
        multiline
        rows={2}
        placeholder="Description"
        value={form.description}
        onChange={updateForm("description")}
      />

      {/* Input / Expected Output */}
      <div className="grid grid-cols-2 gap-3">
        <TextFieldFluent
          multiline
          rows={3}
          placeholder="Input"
          value={form.input}
          onChange={updateForm("input")}
        />
        <TextFieldFluent
          multiline
          rows={3}
          placeholder="Expected Output"
          value={form.expectedOutput}
          onChange={updateForm("expectedOutput")}
        />
      </div>

      {/* Weight + Time + Memory */}
      <div className="grid grid-cols-3 gap-3">
        <TextFieldFluent
          type="number"
          min={0}
          label="Weight"
          value={form.weight}
          onChange={updateForm("weight")}
        />
        <TextFieldFluent
          type="number"
          min={0}
          placeholder="Time Limit (ms)"
          value={form.timeLimitMs ?? ""}
          onChange={updateForm("timeLimitMs")}
        />
        <TextFieldFluent
          type="number"
          min={0}
          placeholder="Memory (KB)"
          value={form.memoryKb ?? ""}
          onChange={updateForm("memoryKb")}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button type="submit" className="button-orange" disabled={loading}>
          Add
        </button>
      </div>
    </form>
  )
}

export default NewTestCaseForm
