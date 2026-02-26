<<<<<<< HEAD
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { t } = useLanguage();
  const { login, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(identifier, password);
      onClose();
      // Reset form
      setIdentifier('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        
        <h2 className="text-2xl font-bold mb-6">
          {t('modal.login')}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-md">
            <p className="text-red-700 dark:text-red-400 text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {t('modal.emailOrUsername')}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
              placeholder={t('modal.emailOrUsernamePlaceholder')}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              {t('modal.password')}
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
            className="w-full bg-green-600 dark:bg-blue-600 text-white py-2 rounded-md hover:bg-green-700 dark:hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {t('modal.loggingIn')}
              </span>
            ) : (
              t('modal.login')
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="text-sm text-green-600 dark:text-blue-400 hover:underline focus:outline-none"
          >
            {t('modal.createAccount')}
          </button>
        </div>
      </div>
    </div>
  );
=======
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // ← নেভিগেশনের জন্য
import axios from "axios";

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
	isOpen,
	onClose,
	onSwitchToRegister,
}) => {
	const { t } = useLanguage();
	const { login, isLoading } = useAuth();
	const navigate = useNavigate(); // ← নেভিগেশন হুক
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [needsVerification, setNeedsVerification] = useState(false);
	const [unverifiedEmail, setUnverifiedEmail] = useState("");
	const [resendLoading, setResendLoading] = useState(false);
	const [resendSuccess, setResendSuccess] = useState("");

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setNeedsVerification(false);
		setResendSuccess("");

		try {
			await login(identifier, password);
			onClose();
			setIdentifier("");
			setPassword("");
		} catch (err: any) {
			// Check if error is due to unverified email
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
			// নতুন এন্ডপয়েন্ট: /auth/resend-code (কোড পাঠায়)
			await axios.post(
				`${import.meta.env.VITE_API_URL}/auth/resend-code`,
				{
					email: unverifiedEmail,
				},
			);
			setResendSuccess(t("modal.verificationEmailResent"));
		} catch (err: any) {
			setError(err.response?.data?.message || t("modal.resendFailed"));
		} finally {
			setResendLoading(false);
		}
	};

	const handleGoToVerify = () => {
		onClose(); // মডাল বন্ধ করুন
		// ভেরিফিকেশন পৃষ্ঠায় নেভিগেট করুন, ইমেল পাঠান
		navigate('/verify-code', { state: { email: unverifiedEmail } });
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
				>
					<i className="fas fa-times text-xl"></i>
				</button>

				<h2 className="text-2xl font-bold mb-6">{t("modal.login")}</h2>

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
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
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

						<div className="mb-6">
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
							className="w-full bg-green-600 dark:bg-blue-600 text-white py-2 rounded-md hover:bg-green-700 dark:hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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

				<div className="mt-4 text-center">
					<button
						onClick={() => {
							onClose();
							onSwitchToRegister();
						}}
						className="text-sm text-green-600 dark:text-blue-400 hover:underline focus:outline-none"
					>
						{t("modal.createAccount")}
					</button>
				</div>
			</div>
		</div>
	);
>>>>>>> save-code
};

export default LoginModal;