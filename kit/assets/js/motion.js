// motion.js: scene timelines read easing and pacing from the active theme,
// so swapping theme.css changes the feel without touching scene code.
//   tl.fromTo(el, {...}, { ..., duration: pv.d(0.5), ease: pv.ease("enter") }, pv.t(1.2));
// pv.d scales durations; pv.t is for in-scene offsets only; never use it on
// data-start values in the root, which stay locked to the music beats.
(function () {
  var css = getComputedStyle(document.documentElement);
  function v(name, fallback) {
    var value = css.getPropertyValue("--motion-" + name).trim();
    return value || fallback;
  }
  var speed = parseFloat(v("speed", "1")) || 1;
  window.pv = {
    ease: function (kind) {
      var fallbacks = { enter: "power3.out", exit: "power2.in", pop: "back.out(1.6)", move: "power2.inOut" };
      return v(kind, fallbacks[kind] || "power2.out");
    },
    d: function (seconds) {
      return seconds * speed;
    },
    t: function (seconds) {
      return seconds * speed;
    },
    push: parseFloat(v("push", "1.03")) || 1.03,
  };
})();
