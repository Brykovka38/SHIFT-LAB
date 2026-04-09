function OtpStep({
  phone,
  otp,
  otpError,
  apiError,
  timer,
  isLoading,
  onOtpChange,
  onLogin,
  onResend,
}) {
  return (
    <div className="auth-step">
      <h1 className="auth-title">Вход</h1>

      <p className="auth-subtitle">
        Введите проверочный код для входа
        <br />
        в личный кабинет
      </p>

      <input className="auth-input" type="text" value={phone} readOnly />

      <input
        className={`auth-input ${otpError ? "auth-input-error" : ""}`}
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="Проверочный код"
        value={otp}
        onChange={(e) => onOtpChange(e.target.value)}
      />

      {otpError && <p className="auth-error">{otpError}</p>}
      {apiError && <p className="auth-error">{apiError}</p>}

      <button
        className="auth-primary-button"
        onClick={onLogin}
        disabled={isLoading}
      >
        {isLoading ? "Вход..." : "Войти"}
      </button>

      {timer > 0 ? (
        <p className="auth-timer">
          Запросить код повторно можно через {timer} секунд
        </p>
      ) : (
        <button
          type="button"
          className="auth-resend-button"
          onClick={onResend}
          disabled={isLoading}
        >
          Запросить код ещё раз
        </button>
      )}
    </div>
  );
}

export default OtpStep;