document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burgerBtn');
  const nav = document.querySelector('.nav');

  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Закрывать меню при клике на ссылку
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('active');
      nav.classList.remove('active');
    });
  });
});