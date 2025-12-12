import Editor from "@monaco-editor/react";
import { useMemo } from "react";

const CodeEditor = ({
  value,
  onChange,
  language = "python",
  theme = "vs-dark",
  height = "100%",
  width = "100%",
  ...props
}) => {
  return (
    <Editor
      value={value}
      onChange={(newValue) => onChange(newValue || '')}
      language={"python"}
      theme={theme}
      height={height}
      width={width}
      {...props}
    />
  );
};

export default CodeEditor;