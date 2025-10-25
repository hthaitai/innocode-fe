import { schoolApi } from "../api/schoolApi";

export const schoolService = {
  // ----- READ ALL -----
  async getAllSchools() {
    const { data } = await schoolApi.getAll();
    // Optional: sort by name for consistent UI
    return data.sort((a, b) => a.name.localeCompare(b.name));
  },

  // ----- READ ONE -----
  async getSchool(id) {
    const { data } = await schoolApi.getById(id);
    return data;
  },

  // ----- READ BY PROVINCE -----
  async getSchoolsByProvince(provinceId) {
    const { data } = await schoolApi.getAll();
    // Filter client-side (or adjust backend endpoint if supported)
    return data.filter((school) => school.province_id === Number(provinceId));
  },

  // ----- CREATE -----
  async createSchool(newSchool) {
    const { data } = await schoolApi.create(newSchool);
    return data;
  },

  // ----- UPDATE -----
  async updateSchool(id, updatedSchool) {
    const { data } = await schoolApi.update(id, updatedSchool);
    return data;
  },

  // ----- DELETE -----
  async deleteSchool(id) {
    const { data } = await schoolApi.delete(id);
    return data;
  },
};
