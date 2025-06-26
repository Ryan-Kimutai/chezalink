// Page Loader
window.addEventListener("load", () => {
  document.getElementById("loader").style.display = "none";
});

// Team member data
const teamMembers = [
  {
    name: "Ryan Kimutai",
    role: "Project Lead/Lead Dev",
    image: "Ryan2.jpg",
    github: "https://github.com/Ryan-Kimutai",
    linkedin: "https://linkedin.com/in/amina"
  },
  {
    name: "Brian Kamau",
    role: "Backend Developer",
    image: "Brayo2.jpg",
    github: "https://github.com/collosalsteppa",
    linkedin: "https://www.linkedin.com/in/brian-kamau-692575371/"
  },
  {
    name: "Kweyah Polo",
    role: "Frontend Developer",
    image: "Kweyah.jpg",
    github: "https://github.com/kweyah",
    linkedin: "https://www.linkedin.com/in/kweyah-polo-674a99175/"
  },
  {
    name: "Joshua Muimi",
    role: "UI/UX Designer",
    image: "Joshu.jpg",
    github: "https://github.com/SaintMuimi",
    linkedin: "https://www.linkedin.com/in/josh-gamer-7aa777305/"
  },
  {
    name: "Hillary Inyait",
    role: "Research and Database Management",
    image: "Hilla2.jpg",
    github: "https://github.com/HillaryInyait",
    linkedin: "http://www.linkedin.com/in/hillary-inyait"
  }
];

// Inject cards
const teamContainer = document.getElementById("team-cards-container");

teamMembers.forEach(member => {
  const card = document.createElement("div");
  card.classList.add("team-card");

  card.innerHTML = `
    <img src="${member.image}" alt="${member.name}">
    <h3>${member.name}</h3>
    <p>${member.role}</p>
    <div class="social-links">
      <a href="${member.github}" target="_blank"><i class="fab fa-github"></i></a>
      
      <a href="${member.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>
    </div>
  `;

  teamContainer.appendChild(card);
});

// Scroll reveal effect for cards
function revealCardsOnScroll() {
  const cards = document.querySelectorAll('.team-card');
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      card.classList.add('visible');
    }
  });
}

window.addEventListener("scroll", revealCardsOnScroll);
window.addEventListener("load", revealCardsOnScroll);

// Smooth scroll arrows
document.querySelectorAll(".scroll-down").forEach(arrow => {
  arrow.addEventListener("click", () => {
    const current = arrow.closest("section");
    const next = current.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: "smooth" });
  });
});
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

  