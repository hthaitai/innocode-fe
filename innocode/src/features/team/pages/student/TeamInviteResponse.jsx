import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { teamInviteApi } from "../../../../api/teamInviteApi";
import PageContainer from "@/shared/components/PageContainer";
import { Icon } from "@iconify/react";

const TeamInviteResponse = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const action = searchParams.get("action");
  const hasProcessed = useRef(false); // Prevent duplicate processing

  const handleAcceptInvite = async () => {
    if (!token || !email || hasProcessed.current) return; // Prevent duplicate calls
    hasProcessed.current = true;
    setLoading(true);
    setStatus("processing");
    let isSuccess = false; // Track success state locally
    try {
      const response = await teamInviteApi.accept(token, email);
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

        isSuccess = true;
        setStatus("success");
        setMessage(successMessage);

        // Auto redirect after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
        return; // Exit early on success to prevent error handling
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      // Only handle error if request was not successful
      if (isSuccess) {
        console.warn("⚠️ Error occurred after successful invite - ignoring");
        return;
      }

      console.error("❌ Accept invite error:", error);
      console.error("❌ Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Only show error if it's a real error (not just a logged error from interceptor)
      if (error.response && error.response.status >= 400) {
        setStatus("error");
        const errorData = error.response?.data;
        const errorMessage =
          errorData?.errorMessage ||
          errorData?.message ||
          errorData?.data?.message ||
          (error.response.status === 500
            ? "Server error occurred. Please try again later or contact support."
            : `Failed to accept invitation. (${error.response.status})`);
        setMessage(errorMessage);
      } else if (error.message) {
        // Network error or other non-HTTP errors
        setStatus("error");
        setMessage(
          error.message || "Failed to accept invitation. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineInvite = async () => {
    if (!token || !email || hasProcessed.current) return; // Prevent duplicate calls
    hasProcessed.current = true;
    setLoading(true);
    setStatus("processing");
    let isSuccess = false; // Track success state locally
    try {
      const response = await teamInviteApi.decline(token, email);
      console.log("✅ Decline invite response:", response);
      console.log("✅ Decline invite response data:", response.data);

      // Check if response is successful (accept 200, 201, 204)
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        const responseData = response.data?.data || response.data;
        const successMessage =
          responseData?.additionalData ||
          response.data?.additionalData ||
          responseData?.message ||
          response.data?.message ||
          "Invitation declined successfully.";

        isSuccess = true;
        setStatus("success");
        setMessage(successMessage);

        // Auto redirect after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
        return; // Exit early on success to prevent error handling
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      // Only handle error if request was not successful
      if (isSuccess) {
        console.warn("⚠️ Error occurred after successful decline - ignoring");
        return;
      }

      console.error("❌ Decline invite error:", error);
      console.error("❌ Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        error: error,
      });

      // Only show error if it's a real error
      if (error.response && error.response.status >= 400) {
        setStatus("error");
        const errorData = error.response?.data;
        const errorCode = errorData?.errorCode;
        const errorMessage =
          errorData?.errorMessage ||
          errorData?.message ||
          errorData?.data?.message ||
          (error.response.status === 500
            ? "Server error occurred. The invitation may have already been processed. Please check your team status or contact support if the issue persists."
            : error.response.status === 400
            ? "Invalid request. The invitation may have expired or already been processed."
            : `Failed to decline invitation. (${error.response.status})`);

        // Show user-friendly message based on error code
        let userMessage = errorMessage;
        if (errorCode === "INTERNAL_SERVER_ERROR") {
          userMessage =
            "Server error occurred. The invitation may have already been processed. Please check your team status.";
        } else if (
          errorCode === "VALIDATION_ERROR" ||
          error.response.status === 400
        ) {
          userMessage =
            "Invalid request. The invitation may have expired or already been processed.";
        }

        setMessage(userMessage);
      } else if (error.message) {
        setStatus("error");
        setMessage(
          error.message || "Failed to decline invitation. Please try again."
        );
      } else {
        // Fallback for any other error case
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Process invite action - no authentication required
    if (hasProcessed.current) return;
    
    if (!token) {
      setStatus("error");
      setMessage("Invalid invitation link. No token provided.");
      return;
    }
    
    if (!email) {
      setStatus("error");
      setMessage("Invalid invitation link. Email is missing. Please use the link from your invitation email.");
      return;
    }
    
    if (action) {
      if (action === "accept") {
        handleAcceptInvite();
      } else if (action === "decline") {
        handleDeclineInvite();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email, action]);

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
            <button onClick={() => navigate("/")} className="button-orange">
              Go to Home
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
              <p className="text-sm text-gray-500">Redirecting to home...</p>
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
              <button onClick={() => navigate("/")} className="button-orange">
                Go to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
export default TeamInviteResponse;
