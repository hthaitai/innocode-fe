import Editor from "@monaco-editor/react";
import { useMemo } from "react";

const CodeEditor = ({
  value,
  onChange,
  language = "python",
  theme = "vs-dark",
  height = "100%",
  width = "100%",
  readOnly = false,
  ...props
}) => {
  return (
    <Editor
      value={value}
      onChange={readOnly ? undefined : (newValue) => onChange && onChange(newValue || '')}
      language={"python"}
      theme={theme}
      height={height}
      width={width}
      options={{
        readOnly,
        ...props.options,
      }}
      {...props}
    />
  );
};

export default CodeEditor;