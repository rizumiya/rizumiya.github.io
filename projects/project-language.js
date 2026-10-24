document.addEventListener('DOMContentLoaded', () => {
  const languageButtons = document.querySelectorAll('.language-button');
  const languageContent = document.querySelectorAll('[data-lang-content]');

  languageButtons.forEach(button => {
    button.addEventListener('click', () => {
      const language = button.dataset.language;
      if (language !== 'id' && language !== 'en') return;

      document.documentElement.lang = language;
      languageContent.forEach(element => {
        element.hidden = element.dataset.langContent !== language;
      });
      languageButtons.forEach(languageButton => {
        const isActive = languageButton === button;
        languageButton.classList.toggle('is-active', isActive);
        languageButton.setAttribute('aria-pressed', String(isActive));
      });
    });
  });
});
