import { provinceApi } from '@/api/provinceApi'

export const provinceService = {
  // ----- READ ALL -----
  async getAllProvinces() {
    const { data } = await provinceApi.getAll()
    // Optional: sort or transform data before returning
    return data.sort((a, b) => a.name.localeCompare(b.name))
  },

  // ----- READ ONE -----
  async getProvince(id) {
    const { data } = await provinceApi.getById(id)
    return data
  },

  // ----- CREATE -----
  async createProvince(newProvince) {
    const { data } = await provinceApi.create(newProvince)
    return data
  },

  // ----- UPDATE -----
  async updateProvince(id, updatedProvince) {
    const { data } = await provinceApi.update(id, updatedProvince)
    return data
  },

  // ----- DELETE -----
  async deleteProvince(id) {
    const { data } = await provinceApi.delete(id)
    return data
  },
}
