import submissionApi from "../../../api/submissionApi"

const submissionService = {
    async downloadById(submissionId) {
        const res = await submissionApi.downloadById(submissionId)
        return res.data
    }
}

export default submissionService