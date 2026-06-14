document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.getElementById("burgerBtn");
  const nav = document.querySelector(".nav");

  burgerBtn.addEventListener("click", () => {
    burgerBtn.classList.toggle("active");
    nav.classList.toggle("active");
  });

  // Закрывать меню при клике на ссылку
  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      burgerBtn.classList.remove("active");
      nav.classList.remove("active");
    });
  });
});

// ========== ПОПАП АУДИТА ==========
const auditBtn = document.getElementById("auditBtn");
const auditPopup = document.getElementById("auditPopup");
const closeAuditBtn = document.getElementById("closeAuditPopup");
const auditForm = document.getElementById("auditForm");
const customTimeRadio = document.getElementById("customTimeRadio");
const customTimeInput = document.getElementById("customTimeInput");
const phoneInput = document.getElementById("auditPhone");

// Автоформатирование номера телефона
phoneInput.addEventListener("input", function () {
  let value = this.value;

  // Оставляем только цифры и ведущий плюс, если он есть
  let cleaned = value.replace(/(?!^\+)\D/g, "");
  // Если первый символ не плюс и начинается с 9, добавляем +7
  if (cleaned.length > 0 && cleaned[0] !== "+" && cleaned[0] === "9") {
    cleaned = "+7" + cleaned.substring(1);
  }
  this.value = cleaned;
});

// Открытие попапа
auditBtn.addEventListener("click", () => {
  auditPopup.classList.add("active");
  document.body.classList.add("no-scroll");
});

// Закрытие попапа (крестик)
closeAuditBtn.addEventListener("click", () => {
  auditPopup.classList.remove("active");
  document.body.classList.remove("no-scroll");
  resetForm();
});

// Закрытие по клику на фон
auditPopup.addEventListener("click", (e) => {
  if (e.target === auditPopup) {
    auditPopup.classList.remove("active");
    document.body.classList.remove("no-scroll");
    resetForm();
  }
});

// Закрытие по Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && auditPopup.classList.contains("active")) {
    auditPopup.classList.remove("active");
    document.body.classList.remove("no-scroll");
    resetForm();
  }
});

// Логика "Свой вариант"
customTimeRadio.addEventListener("change", () => {
  if (customTimeRadio.checked) {
    customTimeInput.classList.add("visible");
    customTimeInput.disabled = false;
  }
});

// Сброс поля "Свой вариант" при выборе других радио
document.querySelectorAll('input[name="callTime"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio !== customTimeRadio) {
      customTimeInput.classList.remove("visible");
      customTimeInput.disabled = true;
      customTimeInput.value = "";
    }
  });
});

// Валидация и отправка
auditForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  let isValid = true;

  // Имя
  const name = document.getElementById("auditName");
  if (!name.value.trim()) {
    showError("nameError", "Введите имя");
    name.classList.add("invalid");
    isValid = false;
  }

  // Телефон (с ужесточённой проверкой)
  const phone = document.getElementById("auditPhone");
  const rawValue = phone.value.trim();
  const digitsOnly = rawValue.replace(/\D/g, ""); // только цифры (без '+')

  if (!rawValue) {
    showError("phoneError", "Введите номер телефона");
    phone.classList.add("invalid");
    isValid = false;
  } else if (digitsOnly.length !== 11) {
    showError(
      "phoneError",
      "Номер должен содержать 11 цифр (без учёта знака +)",
    );
    phone.classList.add("invalid");
    isValid = false;
  } else if (!/^(\+7|8)\d{10}$/.test(rawValue.replace(/[\s\-()]/g, ""))) {
    showError(
      "phoneError",
      "Некорректный формат номера (ожидается +7xxxxxxxxxx или 8xxxxxxxxxx)",
    );
    phone.classList.add("invalid");
    isValid = false;
  }

  // Согласие
  const consent = document.getElementById("auditConsent");
  if (!consent.checked) {
    showError("consentError", "Необходимо дать согласие");
    isValid = false;
  }

  if (isValid) {
    // Показать сообщение об успехе
    const formSuccess = document.getElementById("formSuccess");
    if (formSuccess) {
      auditForm.style.display = "none";
      formSuccess.classList.add("visible");
    }

    // Закрыть попап через 3 секунды
    setTimeout(() => {
      auditPopup.classList.remove("active");
      document.body.classList.remove("no-scroll");
      resetForm();
      // Вернуть видимость формы для следующего открытия
      auditForm.style.display = "";
      if (formSuccess) formSuccess.classList.remove("visible");
    }, 3000);
  }
});

// Убираем ошибки при вводе
document.querySelectorAll(".form-audit__input").forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("invalid");
    const errorId = input.id + "Error";
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = "";
  });
});

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function clearErrors() {
  document
    .querySelectorAll(".form-audit__error")
    .forEach((el) => (el.textContent = ""));
  document
    .querySelectorAll(".form-audit__input")
    .forEach((el) => el.classList.remove("invalid"));
}

function resetForm() {
  auditForm.reset();
  clearErrors();
  customTimeInput.classList.remove("visible");
  customTimeInput.disabled = true;
  auditForm.style.display = "";
  const formSuccess = document.getElementById("formSuccess");
  if (formSuccess) formSuccess.classList.remove("visible");
}

// ========== БЕСКОНЕЧНАЯ ПРОКРУТКА ЛОГОТИПОВ (с плавной остановкой) ==========
const marquee = document.getElementById("marquee");
const track = document.getElementById("marqueeTrack");
const logos = track.querySelectorAll(".marquee__logo");

logos.forEach((logo) => {
  const clone = logo.cloneNode(true);
  track.appendChild(clone);
});

const baseSpeed = 0.5;
let currentSpeed = baseSpeed;
let position = 0;
let animationId;
let isHovering = false;

function animate() {
  const targetSpeed = isHovering ? 0 : baseSpeed;
  const easing = 0.08;
  currentSpeed += (targetSpeed - currentSpeed) * easing;

  if (Math.abs(currentSpeed) < 0.01 && isHovering) {
    animationId = requestAnimationFrame(animate);
    return;
  }

  position -= currentSpeed;
  track.style.transform = `translateX(${position}px)`;

  const singleSetWidth = track.scrollWidth / 2;
  if (position <= -singleSetWidth) {
    position += singleSetWidth;
  }

  animationId = requestAnimationFrame(animate);
}

animate();

marquee.addEventListener("mouseenter", () => {
  isHovering = true;
  marquee.classList.add("paused");
});

marquee.addEventListener("mouseleave", () => {
  isHovering = false;
  marquee.classList.remove("paused");
});
