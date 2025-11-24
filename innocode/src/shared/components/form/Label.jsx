// Reusable Label component
const Label = ({ htmlFor, children, required }) => (
  <label className="pt-1" htmlFor={htmlFor}>
    {children} {required && <span className="text-red-500">*</span>}
  </label>
)

export default Label