import Label from "../../../shared/components/form/Label"
import TextFieldFluent from "../../../shared/components/TextFieldFluent"
import { useTranslation } from "react-i18next"

export default function RubricItem({
  index,
  item,
  scoreObj,
  onChange,
  error,
  readOnly = false,
}) {
  const { t } = useTranslation("judge")

  return (
    <div className="border rounded-[5px] text-sm leading-5 bg-white border-[#E5E5E5]">
      {/* Question with bottom border */}
      <div className="border-b border-[#E5E5E5] p-5 min-h-[70px] flex items-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#E05307]">
              {t("evaluation.rubricItem.criteria", { index: index + 1 })}
            </span>
            <span className="text-[#7A7574]">
              {t("evaluation.rubricItem.points", { points: item.maxScore })}
            </span>
          </div>
          <p>{item.description}</p>
        </div>
      </div>

      {/* Input fields */}
      <div className="p-5 space-y-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`score-${item.rubricId}`}>
            {t("evaluation.rubricItem.score")}
          </Label>
          <div className="flex flex-col gap-1">
            <TextFieldFluent
              id={`score-${item.rubricId}`}
              type="number"
              value={scoreObj?.score ?? ""}
              onChange={(e) =>
                !readOnly &&
                onChange(
                  item.rubricId,
                  "score",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              style={{ width: "80px" }}
              disabled={readOnly}
              error={!!error?.score}
              helperText={error?.score}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`note-${item.rubricId}`}>
            {t("evaluation.rubricItem.note")}
          </Label>
          <div className="flex flex-col gap-1">
            <TextFieldFluent
              id={`note-${item.rubricId}`}
              value={scoreObj?.note || ""}
              multiline
              rows={6}
              placeholder={t("evaluation.rubricItem.notePlaceholder")}
              onChange={(e) =>
                !readOnly && onChange(item.rubricId, "note", e.target.value)
              }
              disabled={readOnly}
              error={!!error?.note}
              helperText={error?.note}
              maxLength={255}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
