import React, { useCallback, useEffect, useState } from "react";
import { teams as fakeData } from "@/data/contests/teams/teams";
import { teamApi } from "@/api/teamApi";

export const useTeams = () => {
  const [teams, setTeams] = useState(fakeData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----- FETCH ALL -----
  // useEffect(() => {
  //   const fetchTeams = async () => {
  //     try {
  //       setLoading(true)
  //       setError(null)
  //       const data = await teamService.getAllTeams()
  //       setTeams(data)
  //     } catch (err) {
  //       console.error(err)
  //       setError(err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchTeams()
  // }, [])

  // Wrap getMyTeam trong useCallback
  const getMyTeam = useCallback(async (contestId = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamApi.getMyTeam();
  

      // API returns { data: [], message: "...", statusCode: 200, code: "SUCCESS" }
      // Extract actual team data from response.data.data or response.data
      let teamsArray = [];

      if (response.data) {
        // If response.data is an array, use it directly
        if (Array.isArray(response.data)) {
          teamsArray = response.data;
        }
        // If response.data has nested data property
        else if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            teamsArray = response.data.data;
          } else {
            teamsArray = [response.data.data];
          }
        }
        // If response.data is the team object directly
        else if (typeof response.data === "object" && !response.data.message) {
          teamsArray = [response.data];
        }
      }

      // Filter by contestId if provided
      let myTeam = null;
      if (contestId && teamsArray.length > 0) {
        myTeam = teamsArray.find(
          (team) => {
            const teamContestId = team.contestId || team.contest_id;
            return (
              String(teamContestId) === String(contestId) ||
              teamContestId === contestId ||
              teamContestId === parseInt(contestId)
            );
          }
        );
      } else if (teamsArray.length > 0) {
        // If no contestId provided, return first team
        myTeam = teamsArray[0];
      }

      // Don't update teams state here - myTeam is a single object, not an array
      // Teams state should remain as array for addTeam/updateTeam/deleteTeam to work
      return myTeam;
    } catch (err) {
      console.error("❌ getMyTeam error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----- CREATE -----
  const addTeam = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teamApi.create(data);
      const newTeam = response.data;
      // Ensure prev is always an array before spreading
      setTeams((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return [...prevArray, newTeam];
      });
      return newTeam;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----- UPDATE -----
  const updateTeam = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      // const updated = await teamService.updateTeam(id, data)
      const updated = { ...data, team_id: id };

      setTeams((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.map((t) => (t.team_id === id ? updated : t));
      });
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----- DELETE -----
  const deleteTeam = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      // await teamService.deleteTeam(id)
      console.log("[FAKE DELETE] Team ID:", id);
      setTeams((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.filter((t) => t.team_id !== id);
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    teams,
    loading,
    error,
    addTeam,
    getMyTeam,
    updateTeam,
    deleteTeam,
  };
};

export default useTeams;
