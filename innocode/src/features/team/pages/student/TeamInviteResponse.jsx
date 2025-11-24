import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { teamInviteApi } from "../../../../api/teamInviteApi";
import PageContainer from "@/shared/components/PageContainer";
import { Icon } from "@iconify/react";

const TeamInviteResponse = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");
  const action = searchParams.get("action");

  const handleAcceptInvite = async () => {
    if (!token) return;
    setLoading(true);
    setStatus("processing");
    try {
      const response = await teamInviteApi.accept(token);
      console.log("✅ Accept invite response:", response);
      
      // Check if response is successful
      if (response.status === 200 || response.status === 201) {
        const responseData = response.data?.data || response.data;
        const successMessage = 
          responseData?.additionalData || 
          response.data?.additionalData ||
          responseData?.message ||
          response.data?.message ||
          "Invitation accepted successfully. You are now a member of the team.";
        
        setStatus("success");
        setMessage(successMessage);
        
        // Auto redirect after 2 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("❌ Accept invite error:", error);
      
      // Only show error if it's a real error (not just a logged error from interceptor)
      if (error.response && error.response.status >= 400) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || 
          error.response?.data?.errorMessage ||
          error.response?.data?.data?.message ||
          `Failed to accept invitation. (${error.response.status})`
        );
      } else if (error.message) {
        // Network error or other non-HTTP errors
        setStatus("error");
        setMessage(error.message || "Failed to accept invitation. Please try again.");
      } else {
        // If we got here but response was 200, it might be a false error
        // Check if we actually have a successful response
        console.warn("⚠️ Error caught but might be false positive");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineInvite = async () => {
    if (!token) return;
    setLoading(true);
    setStatus("processing");
    try {
      const response = await teamInviteApi.decline(token);
      console.log("✅ Decline invite response:", response);
      
      // Check if response is successful
      if (response.status === 200 || response.status === 201) {
        const responseData = response.data?.data || response.data;
        const successMessage = 
          responseData?.additionalData || 
          response.data?.additionalData ||
          responseData?.message ||
          response.data?.message ||
          "Invitation declined successfully.";
        
        setStatus("success");
        setMessage(successMessage);
        
        // Auto redirect after 2 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("❌ Decline invite error:", error);
      
      // Only show error if it's a real error
      if (error.response && error.response.status >= 400) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || 
          error.response?.data?.errorMessage ||
          error.response?.data?.data?.message ||
          `Failed to decline invitation. (${error.response.status})`
        );
      } else if (error.message) {
        setStatus("error");
        setMessage(error.message || "Failed to decline invitation. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && action) {
      if (action === "accept") {
        handleAcceptInvite();
      } else if (action === "decline") {
        handleDeclineInvite();
      }
    } else if (!token) {
      setStatus("error");
      setMessage("Invalid invitation link. No token provided.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, action]);
  if (!token) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
            <Icon
              icon="mdi:alert-circle"
              width="48"
              className="text-red-500 mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Invalid Invitation
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="button-orange"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }
  return (
    <PageContainer>
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {status === "processing" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#ff6b35] mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Processing...
              </h2>
              <p className="text-gray-600">
                Please wait while we process your request.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <Icon
                icon="mdi:check-circle"
                width="64"
                className="text-green-500 mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Success!
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <Icon
                icon="mdi:alert-circle"
                width="64"
                className="text-red-500 mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Error
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="button-orange"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
export default TeamInviteResponse;