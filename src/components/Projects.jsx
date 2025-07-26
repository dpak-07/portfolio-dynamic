// src/components/Projects.jsx
export default function Projects() {
  return (
    <section id="projects">
      <h2><i className="fas fa-project-diagram"></i> Projects</h2>
      <div className="projects-container">
        <div className="project">
          <img src="images/project1.jpg" alt="Calculator Project" />
          <h3>Calculator</h3>
          <p>A simple calculator built with HTML, CSS, and JavaScript.</p>
          <a href="https://github.com/Deepak-S-github/CODSOFT-TASK-3-CALCULATOR-PPROJECT" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i> Repo
          </a>
        </div>
        <div className="project">
          <img src="images/project2.jpg" alt="Landing Page Project" />
          <h3>Landing Page</h3>
          <p>A responsive landing page built with modern UI elements.</p>
          <a href="https://github.com/Deepak-S-github/CODSOFT-TASK-2-LANDING-PAGE" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i> Repo
          </a>
        </div>
        <div className="project">
          <img src="images/project3.jpg" alt="Hotel Management Project" />
          <h3>Hotel Management</h3>
          <p>A fully working hotel and restaurant management website using MongoDB and Flask.</p>
          <a href="https://github.com/Deepak-S-github/hotel-management" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i> Repo
          </a>
        </div>
      </div>
    </section>
  );
}
