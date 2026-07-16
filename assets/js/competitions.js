/* =================================================================
* Competition list
*
* Loads competition entries from "assets/data/competitions.json" and
* renders them into the "#competition-list" container (portfolio
* compact list markup, see start.html).
*
* To add/edit/remove entries, just edit the JSON file - no need to
* touch this script or the HTML.
==================================================================== */

(function () {
	var container = document.getElementById("competition-list");
	if (!container) return;

	fetch("assets/data/competitions.json")
		.then(function (res) {
			if (!res.ok) throw new Error("HTTP " + res.status);
			return res.json();
		})
		.then(function (items) {
			renderCompetitions(items);
		})
		.catch(function (err) {
			console.error("Could not load assets/data/competitions.json:", err);
		});

	function renderCompetitions(items) {
		container.innerHTML = items.map(renderItem).join("");

		// Re-create the scroll fade-in-up reveal for the newly inserted
		// items, matching the effect used by "tt-anim-fadeinup" elsewhere
		// on the page (see assets/js/theme.js, "Element reveal on scroll").
		if (window.gsap && window.ScrollTrigger) {
			container.querySelectorAll(".tt-anim-fadeinup").forEach(function (el) {
				gsap.timeline({
					scrollTrigger: { trigger: el, start: "top bottom" },
				}).from(el, {
					duration: 2,
					autoAlpha: 0,
					y: 50,
					ease: Expo.easeOut,
					clearProps: "all",
				}, "+=0.3");
			});
		}
	}

	function renderItem(item) {
		return (
			'<div class="pcli-item tt-anim-fadeinup">' +
				'<div class="pcli-item-inner">' +
					'<div class="pcli-col pcli-col-image">' +
						'<div class="pcli-image">' +
							'<img src="' + escapeHtml(item.image) + '" loading="lazy" alt="' + escapeHtml(item.name) + '" />' +
						"</div>" +
					"</div>" +

					'<div class="pcli-col pcli-col-count">' +
						'<div class="pcli-count"></div>' +
					"</div>" +

					'<div class="pcli-col pcli-col-caption">' +
						'<div class="pcli-caption">' +
							'<h2 class="pcli-title">' + escapeHtml(item.name) + "</h2>" +
							'<div class="pcli-categories">' +
								'<div class="pcli-category">' + escapeHtml(item.year) + "</div>" +
								'<div class="pcli-category">' + escapeHtml(item.award) + "</div>" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>" +
			"</div>"
		);
	}

	function escapeHtml(value) {
		return String(value).replace(/[&<>"']/g, function (ch) {
			return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
		});
	}
})();
