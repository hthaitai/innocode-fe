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
        message: `Are you sure you want to delete "${item.name}"?`,
        onConfirm: async (onClose) => {
          try {
            onClose() 
            await dispatch(deleteAction({ [idKey]: item[idKey] })).unwrap()
            toast.success(`${entityName} deleted successfully!`)
            onNavigate?.()
            onSuccess?.()
          } catch {
            toast.error(`Failed to delete ${entityName}.`)
          }
        },
      })
    },
    [dispatch, openModal]
  )

  return { confirmDeleteEntity }
}
