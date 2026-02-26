import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

const VerifyCode = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // রেজিস্ট্রেশন পৃষ্ঠা থেকে ইমেল আসবে
    const stateEmail = location.state?.email;
    if (!stateEmail) {
      navigate('/');
      return;
    }
    setEmail(stateEmail);
  }, [location, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // শুধু ১ ডিজিট নেব

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // অটো-ফোকাস পরবর্তী ইনপুটে
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  const fullCode = code.join('');
  if (fullCode.length !== 6) {
    setError(t('verify.enterSixDigitCode'));
    return;
  }

  setIsLoading(true);
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-code`, {
      email,
      code: fullCode,
    });

    alert(t('verify.success') || 'Email verified successfully!');
    navigate('/'); // ← হোম পৃষ্ঠায় পাঠান
  } catch (err: any) {
    setError(err.response?.data?.message || t('verify.failed'));
  } finally {
    setIsLoading(false);
  }
};

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-code`, { email });
      alert(t('verify.codeResent') || 'New verification code sent!');
      // কোড ইনপুট রিসেট
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } catch (err: any) {
      setError(err.response?.data?.message || t('verify.resendFailed'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-2">
          {t('verify.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {t('verify.subtitle')} <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3 text-center">
              {t('verify.enterCode')}
            </label>
            <div className="flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-md">
              <p className="text-red-700 dark:text-red-400 text-sm text-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 dark:bg-blue-600 text-white py-3 rounded-md hover:bg-green-700 dark:hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {t('verify.verifying')}
              </span>
            ) : (
              t('verify.verifyButton')
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {t('verify.didNotReceive')}
          </p>
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-green-600 dark:text-blue-400 hover:underline disabled:opacity-50"
          >
            {resendLoading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {t('verify.sending')}
              </span>
            ) : (
              t('verify.resendButton')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;