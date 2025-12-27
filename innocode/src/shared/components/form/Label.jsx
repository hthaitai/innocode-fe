// Reusable Label component
const Label = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor}>
    {children} {required && <span className="text-red-500">*</span>}
  </label>
)

export default Label