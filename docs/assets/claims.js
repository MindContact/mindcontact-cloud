/* Rotates the MindContact claims, IT and EN, with a decode effect:
   every letter flickers through random glyphs, then settles from left to right.
   With prefers-reduced-motion the text simply changes. */
(function () {
  "use strict";
  var el = document.getElementById("claim");
  if (!el) return;

  var CLAIMS = [
    ["it", "Soluzioni verticali per un mondo orizzontale"],
    ["en", "Vertical solutions for a horizontal world"],
    ["en", "Develop a better world"],
    ["it", "Con l'anima a 8 bit"],
    ["en", "With an 8-bit soul"]
  ];
  var HOLD_MS = 7000;          // time a claim stays readable
  var STEP_MS = 50;            // one frame of the effect
  var SETTLE_PER_CHAR = 3;     // frames between one letter settling and the next (decode in)
  var DISSOLVE_PER_CHAR = 1;   // faster on the way out
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\|{}[]#@*+=-_";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var index = 0;

  function glyph() { return GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)); }

  function render(target, settled, scrambled) {
    // settled: letters already fixed; scrambled: how many of the remaining still flicker (-1 = all)
    var out = "", i;
    for (i = 0; i < target.length; i++) {
      var ch = target.charAt(i);
      if (i < settled || ch === " ") {
        out += ch === " " ? " " : escape(ch);
      } else if (scrambled < 0 || i < settled + scrambled) {
        out += '<span class="g">' + escape(glyph()) + "</span>";
      } else {
        out += '<span class="g">&nbsp;</span>';
      }
    }
    el.innerHTML = out;
  }

  function escape(c) { return c === "<" ? "&lt;" : c === "&" ? "&amp;" : c; }

  function show(next) {
    var lang = CLAIMS[next][0], text = CLAIMS[next][1];
    el.setAttribute("lang", lang);
    if (reduce) { el.textContent = text; return schedule(); }

    var frames = 0, settled = 0, phase = "in";
    el.classList.add("decoding");
    var timer = setInterval(function () {
      frames++;
      if (phase === "in") {
        // letters appear scrambled a few at a time, then settle one by one
        if (frames % SETTLE_PER_CHAR === 0) settled++;
        render(text, settled, -1);
        if (settled >= text.length) {
          clearInterval(timer);
          el.textContent = text;
          el.classList.remove("decoding");
          schedule();
        }
      }
    }, STEP_MS);
  }

  function scrambleOut(done) {
    if (reduce) return done();
    var text = el.textContent, frames = 0, left = text.length;
    el.classList.add("decoding");
    var timer = setInterval(function () {
      frames++;
      if (frames % DISSOLVE_PER_CHAR === 0) left--;
      // letters dissolve from the right: the last `left` stay scrambled, the rest vanish
      var out = "", i;
      for (i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        if (ch === " ") out += " ";
        else if (i < left) out += '<span class="g">' + escape(glyph()) + "</span>";
        else out += '<span class="g">&nbsp;</span>';
      }
      el.innerHTML = out;
      if (left <= 0) { clearInterval(timer); done(); }
    }, STEP_MS);
  }

  function schedule() {
    setTimeout(function () {
      scrambleOut(function () {
        index = (index + 1) % CLAIMS.length;
        show(index);
      });
    }, HOLD_MS);
  }

  schedule();
})();
