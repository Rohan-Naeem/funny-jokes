// Funny Jokes — copy a joke, search/filter jokes, random joke. No external libraries.
(function () {
  // Copy a joke: each button copies the text of its own joke.
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var jokeEl = btn.closest(".joke");
      if (!jokeEl) return;
      var text = jokeEl.querySelector(".joke-text").innerText.trim();
      function done() { btn.textContent = "Copied!"; setTimeout(function () { btn.textContent = "Copy"; }, 1500); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
      function fallbackCopy(t) {
        var ta = document.createElement("textarea");
        ta.value = t; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  // Search / filter jokes by word.
  var search = document.getElementById("search");
  var count = document.getElementById("search-count");
  var total = document.querySelectorAll(".joke").length;
  function applyFilter() {
    var q = search.value.trim().toLowerCase();
    var shown = 0;
    document.querySelectorAll(".joke").forEach(function (j) {
      var match = !q || j.innerText.toLowerCase().indexOf(q) !== -1;
      j.style.display = match ? "" : "none";
      if (match) shown++;
    });
    // Hide a category section if none of its jokes match.
    document.querySelectorAll("section.category").forEach(function (sec) {
      var anyVisible = sec.querySelectorAll(".joke:not([style*='none'])").length > 0;
      // style check above is unreliable after inline display:""; use computed check instead:
      var visible = 0;
      sec.querySelectorAll(".joke").forEach(function (j) { if (j.style.display !== "none") visible++; });
      sec.style.display = visible ? "" : "none";
    });
    if (count) count.textContent = q ? ("Showing " + shown + " of " + total + " jokes") : (total + " jokes");
  }
  if (search) search.addEventListener("input", applyFilter);

  // Random joke: pick one visible joke, scroll to it and highlight it.
  var randomBtn = document.getElementById("random-btn");
  if (randomBtn) {
    randomBtn.addEventListener("click", function () {
      var visible = [];
      document.querySelectorAll(".joke").forEach(function (j) { if (j.style.display !== "none") visible.push(j); });
      if (!visible.length) return;
      document.querySelectorAll(".joke.highlight").forEach(function (j) { j.classList.remove("highlight"); });
      var pick = visible[Math.floor(Math.random() * visible.length)];
      pick.classList.add("highlight");
      pick.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
})();
