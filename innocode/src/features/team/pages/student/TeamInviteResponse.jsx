import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { teamInviteApi } from "../../../../api/teamInviteApi";
import PageContainer from "@/shared/components/PageContainer";
import { Icon } from "lucide-react";

const TeamInviteResponse = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  cosnt[(status, setStatus)] = useState("processing");
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");
  const action = searchParams.get("action");
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
  }, [token, action]);
  const handleAcceptInvite = async () => {
    if (!token) return;
    setLoading(true);
    setStatus("processing");
    try {
      const response = await teamInviteApi.accept(token);
      console.log("✅ Accept invite response:", response);
      setStatus("success");
      setMessage("Invitation accepted successfully.");
    } catch (error) {
      console.error("❌ Accept invite error:", error);
      setStatus("error");
      setMessage(
        error.response?.data?.message || "Failed to accept invitation."
      );
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
      setStatus("success");
      setMessage("Invitation declined successfully.");
    } catch (error) {
      console.error("❌ Decline invite error:", error);
      setStatus("error");
      setMessage(
        error.response?.data?.message || "Failed to decline invitation."
      );
    } finally {
      setLoading(false);
    }
  };
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