import { useAppDispatch } from "@/store/hooks"
import { useModal } from "@/shared/hooks/useModal"
import { toast } from "react-hot-toast"

export const useCrud = ({
  entityName,
  createAction,
  updateAction,
  deleteAction,
  idKey = "id", // default key
  onSuccess,
}) => {
  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  const openEntityModal = (mode, item = {}) => {
    openModal(entityName, {
      mode,
      initialData: item,
      onSubmit: async (data) => {
        try {
          if (mode === "create") {
            await dispatch(createAction(data)).unwrap()
            toast.success(`${entityName} created successfully!`)
          } else {
            await dispatch(updateAction({ id: item[idKey], data })).unwrap()
            toast.success(`${entityName} updated successfully!`)
          }
          if (onSuccess) onSuccess()
        } catch (err) {
          console.error(err)
          toast.error(`Failed to save ${entityName}.`)
        }
      },
    })
  }

  const confirmDeleteEntity = (item, onNavigate) => {
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
  }

  return { openEntityModal, confirmDeleteEntity }
}
