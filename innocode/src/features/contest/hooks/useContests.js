import { useCallback, useEffect, useState } from "react";
import { contests as fakeData } from "@/data/contests/contests";
import { mapContestFromAPI } from "../../../shared/utils/contestMapper";
import { contestService } from "../services/contestService";
export const useContests = () => {
  const [contests, setContests] = useState([]); // Initialize with empty array instead of undefined
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Actual search term sent to API
  
  // ----- FETCH -----
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contestService.getAllContests({
          nameSearch: searchTerm || undefined,
        });

        // Extract the actual contests array from the response
        const contestsArray = response?.data || response || [];

        const mappedContests = Array.isArray(contestsArray)
          ? contestsArray.map(mapContestFromAPI)
          : [];

        console.log("📊 Raw API response:", response);
        console.log("📦 Contests array:", contestsArray);
        console.log("🗺️ Mapped contests:", mappedContests);
        console.log(
          "✅ Non-draft contests:",
          mappedContests.filter((c) => !c.isDraft)
        );

        setContests(mappedContests);
      } catch (error) {
        setError(error.message || "Failed to load contests");
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [searchTerm]);
  
  // ----- SEARCH -----
  const searchContests = useCallback((term) => {
    setSearchTerm(term || "");
  }, []);
  const getMyContests = useCallback(async (nameSearch) => {
    try {
      setLoading(true);
      setError(null);
      const response = await contestService.getMyContests({
        nameSearch: nameSearch || undefined,
      });
      const contestsArray = response?.data || response || [];
      const mappedContests = Array.isArray(contestsArray)
        ? contestsArray.map(mapContestFromAPI)
        : [];
      return mappedContests;
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to load my contests");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  // ----- CREATE -----
  const addContest = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      // const newContest = await contestService.createContest(data)
      const newContest = {
        contest_id: Date.now(),
        created_at: new Date().toISOString(),
        ...data,
      };

      setContests((prev) => [...prev, newContest]);
      return newContest;
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----- UPDATE -----
  const updateContest = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      // const updated = await contestService.updateContest(id, data)
      const updated = { ...data, contest_id: id };

      setContests((prev) =>
        prev.map((contest) => (contest.contest_id === id ? updated : contest))
      );
      return updated;
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----- DELETE -----
  const deleteContest = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      // await contestService.deleteContest(id)
      console.log("[FAKE DELETE] Contest ID:", id);

      setContests((prev) =>
        prev.filter((contest) => contest.contest_id !== id)
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    contests,
    loading,
    error,
    searchTerm,
    searchContests,
    addContest,
    updateContest,
    deleteContest,
    getMyContests,
  };
};

export default useContests;
