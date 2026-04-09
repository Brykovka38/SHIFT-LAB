function PhoneStep({
  phone,
  phoneError,
  apiError,
  isLoading,
  onPhoneChange,
  onContinue,
}) {
  return (
    <div className="auth-step">
      <h1 className="auth-title">Вход</h1>

      <p className="auth-subtitle">
        Введите номер телефона для входа
        <br />
        в личный кабинет
      </p>

      <input
        className={`auth-input ${phoneError ? "auth-input-error" : ""}`}
        type="tel"
        placeholder="+7 000 000 00 00"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
      />

      {phoneError && <p className="auth-error">{phoneError}</p>}
      {apiError && <p className="auth-error">{apiError}</p>}

      <button
        className="auth-primary-button"
        onClick={onContinue}
        disabled={isLoading}
      >
        {isLoading ? "Отправка..." : "Продолжить"}
      </button>
    </div>
  );
}

export default PhoneStep;