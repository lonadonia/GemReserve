/**
 * Front-end behaviour, ported from the React components.
 *
 * Three things only: the scroll reveal, the desktop dropdowns and the mobile
 * drawer. Each keeps the original's accessibility contract — the reveal is a
 * no-op under prefers-reduced-motion and leaves content visible without
 * JavaScript, the dropdowns answer ArrowDown and Escape, and the drawer traps
 * focus and returns it to the trigger on close.
 */
(function () {
  "use strict";

  // --- MotionReveal -------------------------------------------------------
  // Elements ship visible. Only if the observer exists and motion is welcome do
  // we hide them to animate in, so no-JS and reduced-motion both see content.
  function initReveal() {
    var nodes = document.querySelectorAll(".motion-reveal");
    if (!nodes.length) return;
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.1 }
    );
    requestAnimationFrame(function () {
      nodes.forEach(function (node) {
        node.dataset.motionReady = "true";
        node.classList.remove("is-visible");
        observer.observe(node);
      });
    });
  }

  // --- Desktop dropdowns --------------------------------------------------
  function initDropdowns() {
    var groups = document.querySelectorAll(".desktop-nav-group");
    if (!groups.length) return;

    function closeAll(except) {
      groups.forEach(function (g) {
        if (g === except) return;
        var t = g.querySelector(".desktop-nav-trigger");
        var d = g.querySelector(".desktop-dropdown");
        if (t) t.setAttribute("aria-expanded", "false");
        if (d) {
          d.classList.remove("is-open");
          d.setAttribute("aria-hidden", "true");
          d.inert = true;
        }
      });
    }

    groups.forEach(function (group) {
      var trigger = group.querySelector(".desktop-nav-trigger");
      var dropdown = group.querySelector(".desktop-dropdown");
      if (!trigger || !dropdown) return;
      dropdown.inert = true;

      function open() {
        closeAll(group);
        trigger.setAttribute("aria-expanded", "true");
        dropdown.classList.add("is-open");
        dropdown.setAttribute("aria-hidden", "false");
        dropdown.inert = false;
      }
      function close() {
        trigger.setAttribute("aria-expanded", "false");
        dropdown.classList.remove("is-open");
        dropdown.setAttribute("aria-hidden", "true");
        dropdown.inert = true;
      }

      // Pointer opens on enter and closes on leave. A mouse click arrives
      // after pointerenter has already opened the menu, so a plain toggle here
      // would close it again on the way in — the same trap the React version
      // hit and documented. A click therefore only ever opens; leaving closes.
      // Touch, which fires no pointerenter, still gets an open from the click.
      group.addEventListener("pointerenter", open);
      group.addEventListener("pointerleave", close);
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        open();
      });
      trigger.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          open();
          var first = dropdown.querySelector("a");
          if (first) first.focus();
        }
        if (e.key === "Escape") {
          close();
          trigger.focus();
        }
      });
      group.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          trigger.focus();
        }
      });
      group.addEventListener("focusout", function (e) {
        if (!group.contains(e.relatedTarget)) close();
      });
    });

    document.addEventListener("pointerdown", function (e) {
      var header = document.querySelector(".site-header");
      if (header && !header.contains(e.target)) closeAll(null);
    });
  }

  // --- Mobile drawer ------------------------------------------------------
  function initDrawer() {
    var trigger = document.querySelector(".mobile-menu-trigger");
    var drawer = document.querySelector(".mobile-navigation");
    if (!trigger || !drawer) return;
    var panel = drawer.querySelector(".mobile-navigation-panel");
    var closeBtn = drawer.querySelector(".mobile-navigation-header button");
    var previousOverflow = "";

    function open() {
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
      document.addEventListener("keydown", onKey);
    }
    function close() {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      if (trigger.offsetParent) trigger.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !panel) return;
      var f = panel.querySelectorAll(
        'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
      );
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    trigger.addEventListener("click", open);
    drawer.querySelectorAll(".mobile-navigation-backdrop, .mobile-navigation-header button").forEach(function (el) {
      el.addEventListener("click", close);
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    window.matchMedia("(min-width: 1241px)").addEventListener("change", function (e) {
      if (e.matches) close();
    });
  }

  function init() {
    initReveal();
    initDropdowns();
    initDrawer();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
