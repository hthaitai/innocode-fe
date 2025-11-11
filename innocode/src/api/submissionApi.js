import axiosClient from "./axiosClient"

const submissionApi = {
    //Download submittion by id
    downloadById: (submissionId) => axiosClient.get(`/submissions/${submissionId}/download`)
}

export default submissionApi