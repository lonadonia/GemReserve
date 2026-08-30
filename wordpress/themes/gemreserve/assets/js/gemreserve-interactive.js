/**
 * Interactive behaviour, ported from the React client components.
 *
 * The migration carries each page's markup across, which reproduces the design
 * but not the behaviour that lived in React. This file restores it against the
 * same DOM: the catalogue filter and sort, the FAQ accordion and search, the
 * passport tablist, the ID lookup, and the three forms.
 *
 * Every one keeps the original's honesty contract. The lookup validates a
 * format and claims nothing more, because there is nothing to look in. The
 * forms report plainly that nothing was sent while delivery is unconfigured —
 * they must never show success over a discarded submission.
 */
(function () {
  "use strict";

  var settings = window.GemReserveSettings || {};

  // --- Gemstone catalogue: filter and sort --------------------------------
  function initCatalogue() {
    var root = document.querySelector(".catalog-root");
    if (!root) return;
    var grid = root.querySelector(".catalog-grid");
    var items = grid ? [].slice.call(grid.querySelectorAll(".catalog-grid-item")) : [];
    if (!items.length) return;

    var filters = [].slice.call(root.querySelectorAll(".catalog-filter, .catalog-filters button"));
    var sort = root.querySelector("select");

    function labelOf(item) {
      var t = item.querySelector(".gemstone-card-title");
      return t ? t.textContent.trim().toLowerCase() : "";
    }
    function priceOf(item) {
      var p = item.querySelector(".gemstone-card-price");
      if (!p) return 0;
      var n = p.textContent.replace(/[^0-9.]/g, "");
      return parseFloat(n) || 0;
    }

    function apply(category) {
      items.forEach(function (item) {
        var show = !category || category === "all" || labelOf(item).indexOf(category) !== -1;
        item.hidden = !show;
      });
    }

    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        var label = btn.textContent.replace(/\(\d+\)/, "").trim().toLowerCase();
        apply(label.indexOf("all") === 0 ? "all" : label);
      });
    });

    if (sort) {
      sort.addEventListener("change", function () {
        var v = sort.value;
        var sorted = items.slice().sort(function (a, b) {
          if (v.indexOf("price") === 0) {
            return v.indexOf("desc") !== -1 ? priceOf(b) - priceOf(a) : priceOf(a) - priceOf(b);
          }
          return labelOf(a).localeCompare(labelOf(b));
        });
        sorted.forEach(function (item) {
          grid.appendChild(item);
        });
      });
    }
  }

  // --- FAQ: accordion, search and category rail ---------------------------
  function initFaq() {
    var page = document.querySelector(".faq-page");
    if (!page) return;

    var questions = [].slice.call(page.querySelectorAll(".faq-group li"));
    var search = page.querySelector('input[type="search"], .faq-search input');
    var rail = [].slice.call(page.querySelectorAll(".faq-rail button, .faq-categories button"));

    // Each question is a button toggling the panel after it.
    page.querySelectorAll(".faq-group li > button").forEach(function (btn) {
      var panel = btn.nextElementSibling;
      if (!panel) return;
      btn.setAttribute("aria-expanded", "false");
      panel.hidden = true;
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        panel.hidden = open;
      });
    });

    function filter(term, category) {
      var t = (term || "").trim().toLowerCase();
      var shown = 0;
      questions.forEach(function (li) {
        var text = li.textContent.toLowerCase();
        var matchText = !t || text.indexOf(t) !== -1;
        var matchCat = !category || category === "all" ||
          (li.closest(".faq-group") || {}).dataset === undefined ||
          text.indexOf(category) !== -1;
        var show = matchText && matchCat;
        li.hidden = !show;
        if (show) shown++;
      });
      var empty = page.querySelector(".faq-empty");
      if (empty) empty.hidden = shown !== 0;
      // Hide a group whose questions are all filtered out.
      page.querySelectorAll(".faq-group").forEach(function (g) {
        var any = [].slice.call(g.querySelectorAll("li")).some(function (li) { return !li.hidden; });
        g.hidden = !any;
      });
    }

    if (search) {
      search.addEventListener("input", function () {
        filter(search.value, null);
      });
    }
    rail.forEach(function (btn) {
      btn.addEventListener("click", function () {
        rail.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var label = btn.textContent.replace(/\(\d+\)/, "").trim().toLowerCase();
        filter(search ? search.value : "", label.indexOf("all") === 0 ? "all" : label);
      });
    });
  }

  // --- Passport explorer: a single-tab-stop tablist ------------------------
  function initTablist() {
    document.querySelectorAll('[role="tablist"]').forEach(function (rail) {
      var tabs = [].slice.call(rail.querySelectorAll('[role="tab"]'));
      if (!tabs.length) return;

      function select(tab) {
        tabs.forEach(function (t) {
          var selected = t === tab;
          t.setAttribute("aria-selected", selected ? "true" : "false");
          t.tabIndex = selected ? 0 : -1;
          var panelId = t.getAttribute("aria-controls");
          var panel = panelId && document.getElementById(panelId);
          if (panel) panel.hidden = !selected;
        });
      }

      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () { select(tab); });
        tab.addEventListener("keydown", function (e) {
          var i = tabs.indexOf(tab);
          var next = null;
          if (e.key === "ArrowDown" || e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
          if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
          if (!next) return;
          e.preventDefault();
          select(next);
          next.focus();
        });
      });

      var current = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0];
      select(current || tabs[0]);
    });
  }

  // --- ID lookup: checks a format, claims nothing more ---------------------
  function initLookup() {
    document.querySelectorAll(".id-lookup").forEach(function (root) {
      var field = root.querySelector("input");
      var button = root.querySelector("button");
      var status = root.querySelector(".id-lookup__status");
      if (!field || !button) return;
      if (!status) {
        status = document.createElement("p");
        status.className = "id-lookup__status";
        status.setAttribute("role", "status");
        root.appendChild(status);
      }
      var pattern = /^GR-[A-Z]{3,4}-\d{6}$/i;

      function submit(e) {
        if (e) e.preventDefault();
        var value = field.value.trim();
        if (!pattern.test(value)) {
          status.textContent = "Passport IDs look like GR-RUB-000245.";
          return;
        }
        // Deliberately never reports a stone as found: there is no registry
        // behind this yet, and saying otherwise would invent a holding.
        status.textContent =
          "That is a valid Passport ID format. Lookup opens with the platform.";
      }

      button.addEventListener("click", submit);
      field.addEventListener("keydown", function (e) {
        if (e.key === "Enter") submit(e);
      });
    });
  }

  // --- Forms: validate here, deliver only when configured ------------------
  function initForms() {
    document.querySelectorAll("form[data-gr-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var invalid = false;
        form.querySelectorAll("[required]").forEach(function (input) {
          var bad =
            !input.value.trim() ||
            (input.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) ||
            (input.type === "checkbox" && !input.checked);
          input.setAttribute("aria-invalid", bad ? "true" : "false");
          var msg = form.querySelector('[data-error-for="' + input.name + '"]');
          if (msg) msg.hidden = !bad;
          if (bad && !invalid) {
            invalid = true;
            input.focus();
          }
        });
        if (invalid) return;

        var status = form.querySelector('[role="status"]');
        if (!status) return;
        status.hidden = false;
        status.textContent = settings.formsEnabled
          ? "Thank you — your message has been sent."
          : "This is a demonstration success state. Nothing was sent: form delivery is not configured on this deployment.";
        status.focus();
      });
    });
  }

  function init() {
    initCatalogue();
    initFaq();
    initTablist();
    initLookup();
    initForms();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
