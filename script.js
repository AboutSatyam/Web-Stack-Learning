
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav-links");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");

      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
      menuButton.textContent = isOpen ? "✕" : "☰";
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        menuButton.textContent = "☰";
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        menuButton.textContent = "☰";
      }
    });
  }

  // Scroll-to-top button
  const topButton = document.querySelector(".back-to-top");

  function updateTopButton() {
    if (topButton) {
      topButton.classList.toggle("visible", window.scrollY > 350);
    }
  }

  window.addEventListener("scroll", updateTopButton, {
    passive: true
  });

  updateTopButton();

  if (topButton) {
    topButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Reveal sections while scrolling
  const revealElements = document.querySelectorAll(
    ".welcome-card, .teaching-card, .bhakti-panel, " +
    ".section-heading, .quote-section, .contact-inner, " +
    ".maharaj-card, .jap-counter"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("revealed");
    });
  }

  // Highlight active navigation link
  const navLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

  const sections = document.querySelectorAll(
    "main section[id]"
  );

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${entry.target.id}`;

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-25% 0px -60% 0px" }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // Automatic copyright year
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Button press feedback
  document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("pointerdown", () => {
      button.style.transform = "scale(0.98)";
    });

    ["pointerup", "pointerleave", "pointercancel"].forEach(
      (eventName) => {
        button.addEventListener(eventName, () => {
          button.style.removeProperty("transform");
        });
      }
    );
  });

  // Hindi Radha Naam Jap counter
  const countElement = document.getElementById("jap-count");
  const addButton = document.getElementById("jap-add");
  const minusButton = document.getElementById("jap-minus");
  const resetButton = document.getElementById("jap-reset");
  const goalSelect = document.getElementById("jap-goal");
  const progressBar = document.getElementById("jap-progress-bar");
  const progressText = document.getElementById("jap-progress-text");

  const storageKey = "bhaktiMargRadhaNaamJapCount";

  const hindiDigits = (number) =>
    String(number).replace(
      /\d/g,
      (digit) => "०१२३४५६७८९"[digit]
    );

  if (
    countElement &&
    addButton &&
    minusButton &&
    resetButton &&
    goalSelect &&
    progressBar &&
    progressText
  ) {
    let count = 0;

    try {
      count = Math.max(
        0,
        Number.parseInt(
          localStorage.getItem(storageKey) || "0",
          10
        ) || 0
      );
    } catch (error) {
      count = 0;
    }

    function renderCounter() {
      const goal = Number(goalSelect.value);

      countElement.textContent = hindiDigits(count);

      const percentage = Math.min(
        100,
        (count / goal) * 100
      );

      progressBar.style.width = `${percentage}%`;

      progressText.textContent =
        count >= goal
          ? `बहुत सुंदर! आपने ${hindiDigits(goal)} नामों का लक्ष्य पूरा कर लिया। राधे राधे!`
          : `लक्ष्य पूरा करने के लिए ${hindiDigits(goal - count)} नाम शेष हैं।`;

      try {
        localStorage.setItem(storageKey, String(count));
      } catch (error) {
        // The counter still works if browser storage is unavailable.
      }
    }

    addButton.addEventListener("click", () => {
      count++;
      renderCounter();
    });

    minusButton.addEventListener("click", () => {
      count = Math.max(0, count - 1);
      renderCounter();
    });

    resetButton.addEventListener("click", () => {
      if (confirm("क्या आप नाम जप की गिनती रीसेट करना चाहते हैं?")) {
        count = 0;
        renderCounter();
      }
    });

    goalSelect.addEventListener("change", renderCounter);

    renderCounter();
  }
});
