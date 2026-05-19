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
    { name: "Atlanta, Georgia", lat: 33.749, lng: -84.388 },
    { name: "Athens, Georgia", lat: 33.9519, lng: -83.3576 },
    { name: "Miami, Florida", lat: 25.7617, lng: -80.1918 },
    { name: "Denver, Colorado", lat: 39.7392, lng: -104.9903 },
    { name: "New York City", lat: 40.7128, lng: -74.006 },
    { name: "Athens, Greece", lat: 37.9838, lng: 23.7275 },
    { name: "Rome, Italy", lat: 41.9028, lng: 12.4964 },
    { name: "Venice, Italy", lat: 45.4408, lng: 12.3155 },
    { name: "Paris, France", lat: 48.8566, lng: 2.3522 },
    { name: "Berlin, Germany", lat: 52.52, lng: 13.405 },
    { name: "Amsterdam, Netherlands", lat: 52.3676, lng: 4.9041 },
    { name: "Geneva, Switzerland", lat: 46.2044, lng: 6.1432 },
    { name: "Barcelona, Spain", lat: 41.3874, lng: 2.1686 },
    { name: "Ikaria, Greece", lat: 37.5966, lng: 26.1614, photos: [] },
    { name: "Istanbul, Turkey", lat: 41.0082, lng: 28.9784 },
    { name: "Asheville, North Carolina", lat: 35.5951, lng: -82.5515 },
    { name: "Dublin, Ireland", lat: 53.3498, lng: -6.2603 },
    { name: "London, England", lat: 51.5072, lng: -0.1276 },
  ];

  function travelPopup(place) {
    const photos = place.photos || [];
    const slides = photos.length
      ? photos
          .map(
            (photo, index) => `
              <figure class="travel-slide ${index === 0 ? "is-active" : ""}" data-slide="${index}">
                <img src="${photo.src}" alt="${photo.alt}" />
                <figcaption>${photo.caption}</figcaption>
              </figure>
            `,
          )
          .join("")
      : `
        <div class="travel-empty">
          <strong>Photos coming soon</strong>
          <span>This pin is ready for a mini slideshow.</span>
        </div>
      `;

    const controls =
      photos.length > 1
        ? `
          <div class="travel-popup-controls">
            <button type="button" data-travel-prev aria-label="Previous photo">Prev</button>
            <span data-travel-count>1 / ${photos.length}</span>
            <button type="button" data-travel-next aria-label="Next photo">Next</button>
          </div>
        `
        : "";

    return `
      <section class="travel-popup" data-travel-popup>
        <h3>${place.name}</h3>
        <div class="travel-slides" data-travel-slides>${slides}</div>
        ${controls}
      </section>
    `;
  }

  for (const place of places) {
    const marker = L.marker([place.lat, place.lng], { icon: pinIcon })
      .addTo(map)
      .bindTooltip(place.name, {
        direction: "top",
        offset: [0, -16],
        opacity: 1,
      })
      .bindPopup(travelPopup(place), {
        maxWidth: 300,
        minWidth: 260,
      });

    marker.on("mouseover", () => marker.openTooltip());
    marker.on("mouseout", () => marker.closeTooltip());
    marker.on("click", () => marker.openPopup());
  }

  map.on("popupopen", (event) => {
    const popup = event.popup.getElement();
    const slides = [...popup.querySelectorAll(".travel-slide")];
    const count = popup.querySelector("[data-travel-count]");
    const previous = popup.querySelector("[data-travel-prev]");
    const next = popup.querySelector("[data-travel-next]");
    let activeIndex = 0;

    function setSlide(index) {
      if (!slides.length) return;
      activeIndex = (index + slides.length) % slides.length;

      for (const [slideIndex, slide] of slides.entries()) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      }

      if (count) count.textContent = `${activeIndex + 1} / ${slides.length}`;
    }

    previous?.addEventListener("click", () => setSlide(activeIndex - 1));
    next?.addEventListener("click", () => setSlide(activeIndex + 1));
  });

  requestAnimationFrame(() => map.invalidateSize());
  window.addEventListener("resize", () => map.invalidateSize());
}
