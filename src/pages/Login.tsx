import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const { t } = useLanguage();
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  // যদি ইতিমধ্যে লগইন করা থাকে, তাহলে হোম পৃষ্ঠায় পাঠান
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);
    setResendSuccess("");

    try {
      await login(identifier, password);
      // লগইন সফল হলে হোম পৃষ্ঠায় যান
      navigate("/");
    } catch (err: any) {
      if (err.response?.data?.needsVerification) {
        setNeedsVerification(true);
        setUnverifiedEmail(err.response?.data?.email || identifier);
        setError(t("modal.pleaseVerifyEmail"));
      } else {
        setError(err.message);
      }
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendSuccess("");
    setError("");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-code`, {
        email: unverifiedEmail,
      });
      setResendSuccess(t("modal.verificationEmailResent"));
    } catch (err: any) {
      setError(err.response?.data?.message || t("modal.resendFailed"));
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoToVerify = () => {
    navigate("/verify-code", { state: { email: unverifiedEmail } });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          {t("modal.login")}
        </h2>

        {resendSuccess && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-md">
            <p className="text-green-700 dark:text-green-400 text-sm">
              <i className="fas fa-check-circle mr-2"></i>
              {resendSuccess}
            </p>
          </div>
        )}

        {needsVerification ? (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t("modal.verificationRequired")}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="w-full px-6 py-2 bg-green-600 dark:bg-blue-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-blue-700 transition disabled:opacity-50"
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {t("modal.sending")}
                  </span>
                ) : (
                  t("modal.resendVerification")
                )}
              </button>
              <button
                onClick={handleGoToVerify}
                className="w-full px-6 py-2 border border-green-600 dark:border-blue-600 text-green-600 dark:text-blue-400 rounded-lg hover:bg-green-50 dark:hover:bg-blue-900/20 transition"
              >
                {t("modal.enterCode") || "Enter verification code"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("modal.emailOrUsername")}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
                placeholder={t("modal.emailOrUsernamePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("modal.password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 dark:bg-blue-600 text-white py-2 rounded-md hover:bg-green-700 dark:hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {t("modal.loggingIn")}
                </span>
              ) : (
                t("modal.login")
              )}
            </button>
          </form>
        )}

        {error && !needsVerification && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-md">
            <p className="text-red-700 dark:text-red-400 text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </p>
          </div>
        )}

        {error && needsVerification && (
          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-500 rounded-md">
            <p className="text-yellow-700 dark:text-yellow-400 text-sm">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          {t("modal.noAccount")}{" "}
          <Link
            to="/signup"
            className="text-green-600 dark:text-blue-400 hover:underline"
          >
            {t("modal.createAccount")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;