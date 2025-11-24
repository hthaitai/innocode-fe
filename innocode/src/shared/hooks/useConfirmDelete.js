import { useCallback } from "react"
import { useAppDispatch } from "@/store/hooks"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"

/**
 * useConfirmDelete
 * Generic hook to open a confirm delete modal for any entity.
 */
export const useConfirmDelete = () => {
  const { openModal } = useModal()

  const confirmDeleteEntity = useCallback(
    ({ entityName, item, deleteAction, idKey = "id", onNavigate }) => {
      openModal("confirmDelete", {
        type: entityName,
        item,
        message: `Are you sure you want to delete "${
          item.name || item.title || item.username || "this item"
        }"?`,
        onConfirm: async (onClose) => {
          try {
            // Call mutation directly, don't dispatch
            await deleteAction({ [idKey]: item[idKey] }).unwrap()
            toast.success(`${entityName} deleted successfully!`)
            onClose()
            onNavigate?.()
          } catch (error) {
            console.error(error)
            toast.error(`Failed to delete ${entityName}.`)
          }
        },
      })
    },
    []
  )

  return { confirmDeleteEntity }
}
