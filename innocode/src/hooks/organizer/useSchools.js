import React, { useCallback, useEffect, useState } from "react";
import { schools as fakeData } from "../../data/schools";
import { schoolService } from "../../services/schoolService";

export const useSchools = () => {
  const [schools, setSchools] = useState(fakeData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----- FETCH ALL -----
  // useEffect(() => {
  //   const fetchSchools = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       const data = await schoolService.getAllSchools();
  //       setSchools(data);
  //     } catch (err) {
  //       console.error(err);
  //       setError(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchSchools();
  // }, []);

  // ----- CREATE -----
  const addSchool = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      // const newSchool = await schoolService.createSchool(data);
      const newSchool = {
        school_id: Date.now(),
        created_at: new Date().toISOString(),
        ...data,
      };
      setSchools((prev) => [...prev, newSchool]);
      return newSchool;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----- UPDATE -----
  const updateSchool = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      // const updated = await schoolService.updateSchool(id, data);
      const updated = { ...data, school_id: id };
      setSchools((prev) =>
        prev.map((s) => (s.school_id === id ? updated : s))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----- DELETE -----
  const deleteSchool = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      // await schoolService.deleteSchool(id);
      console.log("[FAKE DELETE] School ID:", id);
      setSchools((prev) => prev.filter((s) => s.school_id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----- FILTER BY PROVINCE -----
  const getSchoolsByProvince = useCallback(
    (provinceId) => schools.filter((s) => s.province_id === provinceId),
    [schools]
  );

  return {
    schools,
    loading,
    error,
    addSchool,
    updateSchool,
    deleteSchool,
    getSchoolsByProvince,
  };
};

export default useSchools;
