import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const { t } = useLanguage();
  const { register, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    study_level: "SSC" as "SSC" | "HSC",
    group: "Science" as "Science" | "Arts" | "Commerce",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // যদি ইতিমধ্যে লগইন করা থাকে, তাহলে হোম পৃষ্ঠায় পাঠান
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("modal.passwordsDoNotMatch"));
      return;
    }

    if (formData.password.length < 6) {
      setError(t("modal.passwordTooShort"));
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);

      // রেজিস্ট্রেশন সফল – ভেরিফিকেশন পৃষ্ঠায় পাঠান (ইমেল সহ)
      navigate("/verify-code", { state: { email: formData.email } });

      // ফর্ম রিসেট করার দরকার নেই, কারণ পৃষ্ঠা ছেড়ে চলে যাচ্ছে
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          {t("modal.signUp")}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-md">
            <p className="text-red-700 dark:text-red-400 text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("modal.username")} *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
              placeholder={t("modal.usernamePlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("modal.fullName")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
              placeholder={t("modal.fullNamePlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("modal.email")} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("modal.phone")}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
              placeholder="+8801XXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("modal.studyLevel")} *
            </label>
            <select
              name="study_level"
              value={formData.study_level}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
            >
              <option value="SSC">SSC</option>
              <option value="HSC">HSC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("modal.group")} *
            </label>
            <select
              name="group"
              value={formData.group}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
            >
              <option value="Science">{t("modal.science")}</option>
              <option value="Arts">{t("modal.arts")}</option>
              <option value="Commerce">{t("modal.commerce")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("modal.password")} *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("modal.passwordHint")}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("modal.confirmPassword")} *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
                {t("modal.signingUp")}
              </span>
            ) : (
              t("modal.signUp")
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          {t("modal.alreadyHaveAccount")}{" "}
          <Link
            to="/login"
            className="text-green-600 dark:text-blue-400 hover:underline"
          >
            {t("modal.login")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;