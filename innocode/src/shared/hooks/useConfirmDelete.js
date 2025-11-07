import { useCallback } from "react"
import { useAppDispatch } from "@/store/hooks"
import { useModal } from "@/shared/hooks/useModal" // assuming you have a modal system
import toast from "react-hot-toast"

export const useConfirmDelete = () => {
  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  const confirmDeleteEntity = useCallback(
    ({
      entityName,
      item,
      deleteAction,
      idKey = "id",
      onSuccess,
      onNavigate,
    }) => {
      openModal("confirmDelete", {
        type: entityName,
        item,
        onConfirm: async (onClose) => {
          try {
            await dispatch(deleteAction(item[idKey])).unwrap()
            toast.success(`${entityName} deleted successfully!`)
            onClose()
            if (onNavigate) onNavigate()
            if (onSuccess) onSuccess()
          } catch (err) {
            console.error(err)
            toast.error(`Failed to delete ${entityName}.`)
          }
        },
      })
    },
    [dispatch, openModal]
  )

  return { confirmDeleteEntity }
}
