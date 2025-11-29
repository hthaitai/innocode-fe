// src/hooks/organizer/useMentors.js
import React, { useCallback, useEffect, useState } from 'react';
import { mentorApi } from '@/api/mentorApi';
// import { mentorService } from '@/features/mentorService'

export const useMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----- CREATE -----
  const addMentor = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      // const newMentor = await mentorService.createMentor(data)
      const newMentor = {
        mentor_id: Date.now(),
        created_at: new Date().toISOString(),
        ...data,
      };
      setMentors((prev) => [...prev, newMentor]);
      return newMentor;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----- UPDATE -----
  const updateMentor = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      // const updated = await mentorService.updateMentor(id, data)
      const updated = { ...data, mentor_id: id };
      setMentors((prev) => prev.map((m) => (m.mentor_id === id ? updated : m)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----- DELETE -----
  const deleteMentor = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      // await mentorService.deleteMentor(id)
      console.log('[FAKE DELETE] Mentor ID:', id);
      setMentors((prev) => prev.filter((m) => m.mentor_id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----- FILTER BY SCHOOL -----
  const getMentorsBySchool = useCallback(
    (schoolId) => mentors.filter((m) => m.school_id === schoolId),
    [mentors]
  );
  const getMentorByUserId = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mentorApi.getByUserId(userId);
      // Ensure mentors is always an array
      const mentorsData = Array.isArray(response.data)
        ? response.data
        : response.data
        ? [response.data]
        : [];
      setMentors(mentorsData);
    } catch (error) {
      console.error('❌ Error fetching mentor:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    mentors,
    loading,
    error,
    addMentor,
    updateMentor,
    deleteMentor,
    getMentorsBySchool,
    getMentorByUserId,
  };
};

export default useMentors;
