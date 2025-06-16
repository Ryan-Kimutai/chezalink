document.addEventListener("DOMContentLoaded", () => {
  const teamData = [
    {
      name: "Ryan Kimutai",
      role: "Project Lead/Lead Devloper",
      image: "images/alice.jpg",
      github: "https://github.com/alicewanjiku",
      twitter: "https://twitter.com/alicewanjiku",
      linkedin: "https://linkedin.com/in/alicewanjiku"
    },
    {
      name: "Brian Kamau",
      role: "Backend Developer",
      image: "images/brian.jpg",
      github: "https://github.com/brianotieno",
      twitter: "https://twitter.com/brianotieno",
      linkedin: "https://linkedin.com/in/brianotieno"
    },
    {
      name: "Kweyah Polo",
      role: "Frontend Developer",
      image: "Kweyah ChezaLink.jpg",
      github: "https://github.com/cynthiamwangi",
      twitter: "https://twitter.com/cynthiamwangi",
      linkedin: "https://linkedin.com/in/cynthiamwangi"
    },
    {
      name: "Joshua Muimi",
      role: "UI/UX Designer",
      image: "images/david.jpg",
      github: "https://github.com/davidkimani",
      twitter: "https://twitter.com/davidkimani",
      linkedin: "https://linkedin.com/in/davidkimani"
    },
    {
      name: "Hillary Inyait",
      role: "Research and Database Management",
      image: "images/evelyn.jpg",
      github: "https://github.com/evelynnjeri",
      twitter: "https://twitter.com/evelynnjeri",
      linkedin: "https://linkedin.com/in/evelynnjeri"
    }
  ];

  const teamContainer = document.querySelector(".team-cards");

  teamData.forEach(member => {
    const card = document.createElement("div");
    card.classList.add("team-card");

    const img = document.createElement("img");
    img.src = member.image;
    img.alt = `${member.name}`;

    const name = document.createElement("h3");
    name.textContent = member.name;

    const role = document.createElement("p");
    role.textContent = member.role;

    const socialDiv = document.createElement("div");
    socialDiv.classList.add("social-links");

    socialDiv.innerHTML = `
      <a href="${member.github}" target="_blank"><i class="fab fa-github"></i></a>
      <a href="${member.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>
      <a href="${member.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>
    `;

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(role);
    card.appendChild(socialDiv);

    teamContainer.appendChild(card);
  });
});
