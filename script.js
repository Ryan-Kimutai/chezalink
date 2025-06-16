// Page Loader
window.addEventListener("load", () => {
  document.getElementById("loader").style.display = "none";
});

// Team member data
const teamMembers = [
  {
    name: "Ryan Kimutai",
    role: "Project Lead/Lead Dev",
    image: "images/member1.jpg",
    github: "https://github.com/amina",
    twitter: "https://twitter.com/amina",
    linkedin: "https://linkedin.com/in/amina"
  },
  {
    name: "Brian Kamau",
    role: "Backend Developer",
    image: "images/member2.jpg",
    github: "https://github.com/brian",
    twitter: "https://twitter.com/brian",
    linkedin: "https://linkedin.com/in/brian"
  },
  {
    name: "Kweyah Polo",
    role: "Frontend Developer",
    image: "Kweyah ChezaLink.jpg",
    github: "https://github.com/kweyah",
    twitter: "https://twitter.com/kweyahh",
    linkedin: "https://linkedin.com/in/faith"
  },
  {
    name: "Joshua Muimi",
    role: "UI/UX Designer",
    image: "images/member4.jpg",
    github: "https://github.com/kevin",
    twitter: "https://twitter.com/kevin",
    linkedin: "https://linkedin.com/in/kevin"
  },
  {
    name: "Hillary Inyait",
    role: "Research and Database Management",
    image: "images/member5.jpg",
    github: "https://github.com/lilian",
    twitter: "https://twitter.com/lilian",
    linkedin: "https://linkedin.com/in/lilian"
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
      <a href="${member.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>
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

  