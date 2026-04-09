import { useEffect, useState } from "react";
import PhoneStep from "./PhoneStep";
import OtpStep from "./OtpStep";
import "../styles/login.css";
import { requestOtp, loginWithOtp, getUserSession } from "../api/authApi";

function LoginForm() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [apiError, setApiError] = useState("");

  const [timer, setTimer] = useState(0);
  const [resendTrigger, setResendTrigger] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("8")) {
      digits = "7" + digits.slice(1);
    }

    if (digits.startsWith("9")) {
      digits = "7" + digits;
    }

    if (digits.length > 0 && !digits.startsWith("7")) {
      digits = "7" + digits;
    }

    digits = digits.slice(0, 11);

    if (digits.length === 0) {
      return "";
    }

    let result = "+7";

    if (digits.length > 1) {
      result += " " + digits.slice(1, 4);
    }

    if (digits.length >= 5) {
      result += " " + digits.slice(4, 7);
    }

    if (digits.length >= 8) {
      result += " " + digits.slice(7, 9);
    }

    if (digits.length >= 10) {
      result += " " + digits.slice(9, 11);
    }

    return result;
  };

  const getPhoneDigits = (value) => {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("8")) {
      digits = "7" + digits.slice(1);
    }

    if (digits.startsWith("9")) {
      digits = "7" + digits;
    }

    if (digits.length > 0 && !digits.startsWith("7")) {
      digits = "7" + digits;
    }

    return digits.slice(0, 11);
  };

  const normalizePhoneForApi = (formattedPhone) => {
    const digits = getPhoneDigits(formattedPhone);
    return digits;
  };

  const handlePhoneChange = (value) => {
    const formattedPhone = formatPhone(value);
    setPhone(formattedPhone);

    if (phoneError) {
      setPhoneError("");
    }

    if (apiError) {
      setApiError("");
    }
  };

  const handleOtpChange = (value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setOtp(digitsOnly);

    if (otpError) {
      setOtpError("");
    }

    if (apiError) {
      setApiError("");
    }
  };

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer, resendTrigger]);

  const handleContinue = async () => {
    const digits = getPhoneDigits(phone);

    if (digits.length !== 11) {
      setPhoneError("Введите номер полностью");
      return;
    }

    try {
      setIsLoading(true);
      setPhoneError("");
      setApiError("");

      const response = await requestOtp(normalizePhoneForApi(phone));

      const seconds = Math.ceil(response.retryDelay / 1000);

      setTimer(seconds);
      setOtp("");
      setOtpError("");
      setStep("otp");
    } catch (error) {
      setApiError(error.message || "Не удалось отправить код");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (otp.length !== 6) {
      setOtpError("Код должен состоять из 6 цифр");
      return;
    }

    try {
      setIsLoading(true);
      setOtpError("");
      setApiError("");

      const loginResponse = await loginWithOtp(normalizePhoneForApi(phone), otp);

      setToken(loginResponse.token);

      const sessionResponse = await getUserSession(
        loginResponse.token,
        normalizePhoneForApi(phone)
      );

      setUser(sessionResponse.user);
    } catch (error) {
      setApiError(error.message || "Ошибка авторизации");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      setApiError("");
      setOtp("");
      setOtpError("");

      const response = await requestOtp(normalizePhoneForApi(phone));
      const seconds = Math.ceil(response.retryDelay / 1000);

      setTimer(seconds);
      setResendTrigger((prev) => prev + 1);
    } catch (error) {
      setApiError(error.message || "Не удалось отправить код повторно");
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-step">
            <h1 className="auth-title">Вы вошли</h1>

            <div className="auth-user-card">
              <p>
                <strong>ID:</strong> {user._id}
              </p>
              <p>
                <strong>Телефон:</strong> {user.phone}
              </p>
              <p>
                <strong>Имя:</strong> {user.firstname}
              </p>
              <p>
                <strong>Отчество:</strong> {user.middlename}
              </p>
              <p>
                <strong>Фамилия:</strong> {user.lastname}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Город:</strong> {user.city}
              </p>
              <p>
                <strong>Token:</strong> {token}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {step === "phone" ? (
          <PhoneStep
            phone={phone}
            phoneError={phoneError}
            apiError={apiError}
            isLoading={isLoading}
            onPhoneChange={handlePhoneChange}
            onContinue={handleContinue}
          />
        ) : (
          <OtpStep
            phone={phone}
            otp={otp}
            otpError={otpError}
            apiError={apiError}
            timer={timer}
            isLoading={isLoading}
            onOtpChange={handleOtpChange}
            onLogin={handleLogin}
            onResend={handleResendCode}
          />
        )}
      </div>
    </div>
  );
}

export default LoginForm;