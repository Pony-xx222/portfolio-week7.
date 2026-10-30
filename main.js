/* Shared site JS: mobile nav toggle + auto footer year + contact form demo */
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    // Close menu when a link is clicked (mobile)
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Contact form → save to Supabase "contacts" table
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form && note) {
    var SUPA_URL = "https://hpwkfagoddnufslverbh.supabase.co";
    var SUPA_KEY = "sb_publishable_xfDW7FmmD7vdPRYCBhz_TA_JcIORhGV";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameEl = form.querySelector("[name=name]");
      var emailEl = form.querySelector("[name=email]");
      var msgEl = form.querySelector("[name=message]");
      var payload = {
        name: nameEl ? nameEl.value.trim() : "",
        email: emailEl ? emailEl.value.trim() : "",
        message: msgEl ? msgEl.value.trim() : ""
      };
      if (!payload.name || !payload.email || !payload.message) return;

      var btn = form.querySelector("button[type=submit]");
      var label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }
      note.classList.remove("show", "is-error");

      fetch(SUPA_URL + "/rest/v1/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPA_KEY,
          "Authorization": "Bearer " + SUPA_KEY,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        note.textContent = "Thanks, " + payload.name + "! Your message has been sent. I'll get back to you soon.";
        note.classList.add("show");
        form.reset();
      }).catch(function () {
        note.textContent = "Sorry — your message couldn't be sent. Please try again, or email me directly.";
        note.classList.add("show", "is-error");
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = label; }
        setTimeout(function () { note.classList.remove("show"); }, 8000);
      });
    });
  }
})();
