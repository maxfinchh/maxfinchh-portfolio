document.documentElement.classList.add("js-ready");

const currentPage = document.body.dataset.page || "home";

for (const link of document.querySelectorAll("[data-page-link]")) {
  link.classList.toggle("is-active", link.dataset.pageLink === currentPage);
}

const contactForm = document.querySelector("#contact-form");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();
  const body = [`Name: ${name || ""}`, `Email: ${email || ""}`, "", message || ""].join("\n");
  const mailto = new URL("mailto:tmaxfinch6@gmail.com");

  mailto.searchParams.set("subject", `Portfolio message${name ? ` from ${name}` : ""}`);
  mailto.searchParams.set("body", body);
  window.location.href = mailto.toString();
});

const mapElement = document.querySelector("#travel-map");

if (mapElement && window.L) {
  const map = L.map(mapElement, {
    center: [37.8, 8],
    zoom: 3,
    minZoom: 2,
    maxZoom: 12,
    scrollWheelZoom: true,
    worldCopyJump: true,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const pinIcon = L.divIcon({
    className: "",
    html: '<span class="travel-pin"></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

  const places = [
    ["Atlanta, Georgia", 33.749, -84.388],
    ["Athens, Georgia", 33.9519, -83.3576],
    ["Miami, Florida", 25.7617, -80.1918],
    ["Denver, Colorado", 39.7392, -104.9903],
    ["New York City", 40.7128, -74.006],
    ["Athens, Greece", 37.9838, 23.7275],
    ["Rome, Italy", 41.9028, 12.4964],
    ["Venice, Italy", 45.4408, 12.3155],
    ["Paris, France", 48.8566, 2.3522],
    ["Berlin, Germany", 52.52, 13.405],
    ["Amsterdam, Netherlands", 52.3676, 4.9041],
    ["Geneva, Switzerland", 46.2044, 6.1432],
    ["Barcelona, Spain", 41.3874, 2.1686],
    ["Ikaria, Greece", 37.5966, 26.1614],
    ["Istanbul, Turkey", 41.0082, 28.9784],
    ["Asheville, North Carolina", 35.5951, -82.5515],
    ["Dublin, Ireland", 53.3498, -6.2603],
    ["London, England", 51.5072, -0.1276],
  ];

  for (const [name, lat, lng] of places) {
    L.marker([lat, lng], { icon: pinIcon }).addTo(map).bindPopup(name);
  }
}
