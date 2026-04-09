export function requestOtp(phone) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!phone) {
        reject(new Error("Телефон не передан"));
        return;
      }

      resolve({
        success: true,
        reason: "",
        retryDelay: 40000,
      });
    }, 500);
  });
}

export function loginWithOtp(phone, code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!phone) {
        reject(new Error("Телефон не передан"));
        return;
      }

      if (code !== "123456") {
        reject(new Error("Неверный код"));
        return;
      }

      resolve({
        success: true,
        reason: "",
        user: {
          _id: "user_1",
          phone: phone,
          firstname: "Иван",
          middlename: "Иванович",
          lastname: "Иванов",
          email: "email@gmail.com",
          city: "Москва",
        },
        token: "mock-token-123",
      });
    }, 700);
  });
}

export function getUserSession(token, phone) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        reason: "",
        user: {
          _id: "user_1",
          phone: phone,
          firstname: "Иван",
          middlename: "Иванович",
          lastname: "Иванов",
          email: "email@gmail.com",
          city: "Москва",
        },
      });
    }, 500);
  });
}