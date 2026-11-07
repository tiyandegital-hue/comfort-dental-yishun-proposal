/* Comfort Dental Surgery — shared interactions.
   Mobile nav, scroll reveals, hero entrance, treatment filters,
   FAQ accordion, demo booking-form validation. No external requests. */
(function () {
  "use strict";

  /* Mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-list");
  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var open = navList.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navList.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Scroll reveals */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* Hero entrance */
  var heroH = document.querySelector(".hero-h");
  if (heroH) {
    requestAnimationFrame(function () {
      heroH.querySelectorAll(".line > span").forEach(function (s) { s.classList.add("in"); });
      document.querySelectorAll(".hero-copy .eyebrow, .hero-copy .hero-sub, .hero-copy .hero-ctas, .hero-copy .hero-note").forEach(function (el, i) {
        setTimeout(function () { el.classList.add("in-view"); }, 120 + i * 110);
      });
      var media = document.querySelector(".hero-media");
      if (media) setTimeout(function () { media.classList.add("in-view"); }, 200);
    });
  }

  /* Treatment filter chips */
  var chips = document.querySelectorAll(".chip");
  var cards = document.querySelectorAll(".service-card");
  var status = document.getElementById("filter-status");
  var labels = { all: "All Treatments", preventive: "Preventive", restorative: "Restorative", surgical: "Surgical", cosmetic: "Cosmetic" };
  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); c.setAttribute("aria-pressed", "false"); });
        chip.classList.add("active");
        chip.setAttribute("aria-pressed", "true");
        var filter = chip.getAttribute("data-filter");
        var shown = 0;
        cards.forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-cat") === filter;
          card.classList.toggle("hidden", !match);
          if (match) shown += 1;
        });
        if (status) {
          status.textContent = filter === "all"
            ? "Showing all " + shown + " treatments"
            : "Showing " + shown + " " + labels[filter] + " treatment" + (shown === 1 ? "" : "s") + " of " + cards.length;
        }
      });
    });
  }

  /* FAQ accordion */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var answer = btn.closest(".faq-item").querySelector(".faq-a");
      btn.setAttribute("aria-expanded", String(!expanded));
      answer.hidden = expanded;
    });
  });

  /* Booking form — demo validation (nothing is sent) */
  var form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      function check(input, errorId, valid) {
        var err = document.getElementById(errorId);
        if (!valid) {
          input.classList.add("invalid");
          if (err) err.hidden = false;
          input.setAttribute("aria-invalid", "true");
          ok = false;
        } else {
          input.classList.remove("invalid");
          if (err) err.hidden = true;
          input.removeAttribute("aria-invalid");
        }
      }
      var name = document.getElementById("f-name");
      var phone = document.getElementById("f-phone");
      var email = document.getElementById("f-email");
      var date = document.getElementById("f-date");
      check(name, "e-name", name.value.trim().length >= 2);
      check(phone, "e-phone", phone.value.replace(/\D/g, "").length >= 8);
      check(email, "e-email", email.value.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
      check(date, "e-date", date.value !== "");
      var success = document.getElementById("form-success");
      if (ok) {
        form.querySelectorAll("input, select, textarea, button[type=submit]").forEach(function (el) { el.disabled = true; });
        if (success) { success.hidden = false; success.focus && success.focus(); }
      } else {
        var firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();
      }
    });
    /* Clear error state as the user fixes a field */
    form.querySelectorAll("input, select").forEach(function (input) {
      input.addEventListener("input", function () {
        input.classList.remove("invalid");
        var err = input.closest(".field") && input.closest(".field").querySelector(".field-error");
        if (err) err.hidden = true;
      });
    });
  }
})();
