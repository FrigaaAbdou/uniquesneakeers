const root = document.body;

window.addEventListener("load", () => {
  window.setTimeout(() => {
    root.classList.add("is-loaded");
  }, 900);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  },
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const carousels = document.querySelectorAll("[data-carousel]");

function getSlides(container) {
  return Array.from(container.children);
}

function setActiveSlide(container) {
  const slides = getSlides(container);
  const center = container.scrollLeft + container.clientWidth / 2;
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
    const distance = Math.abs(slideCenter - center);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  slides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === nearestIndex);
  });
}

function scrollCarousel(container, direction) {
  const slides = getSlides(container);
  const activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  const nextIndex = Math.min(
    slides.length - 1,
    Math.max(0, activeIndex + direction),
  );

  slides[nextIndex].scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });
}

carousels.forEach((carousel) => {
  setActiveSlide(carousel);

  let scrollTimeout;
  carousel.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      setActiveSlide(carousel);
    }, 70);
  });

  window.addEventListener("resize", () => setActiveSlide(carousel));
});

document.querySelector('[data-carousel-prev="hero"]')?.addEventListener("click", () => {
  const heroCarousel = document.querySelector('[data-carousel="hero"]');
  if (heroCarousel) {
    scrollCarousel(heroCarousel, -1);
  }
});

document.querySelector('[data-carousel-next="hero"]')?.addEventListener("click", () => {
  const heroCarousel = document.querySelector('[data-carousel="hero"]');
  if (heroCarousel) {
    scrollCarousel(heroCarousel, 1);
  }
});

const dropDate = new Date("2026-04-10T19:00:00+02:00");
const timeParts = {
  days: document.querySelector('[data-time="days"]'),
  hours: document.querySelector('[data-time="hours"]'),
  minutes: document.querySelector('[data-time="minutes"]'),
  seconds: document.querySelector('[data-time="seconds"]'),
};

function updateCountdown() {
  const difference = dropDate.getTime() - Date.now();

  if (difference <= 0) {
    Object.values(timeParts).forEach((part) => {
      if (part) {
        part.textContent = "00";
      }
    });
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (timeParts.days) timeParts.days.textContent = String(days).padStart(2, "0");
  if (timeParts.hours) timeParts.hours.textContent = String(hours).padStart(2, "0");
  if (timeParts.minutes) timeParts.minutes.textContent = String(minutes).padStart(2, "0");
  if (timeParts.seconds) timeParts.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const newsletterForm = document.querySelector(".newsletter-form");
const newsletterNote = document.querySelector(".newsletter-note");

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(newsletterForm);
  const email = form.get("email");

  if (!newsletterNote) {
    return;
  }

  newsletterNote.textContent = `${email} is on the list for early access.`;
  newsletterForm.reset();
});
