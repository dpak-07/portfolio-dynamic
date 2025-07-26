// src/components/Resume.jsx
export default function Resume() {
  return (
    <section id="resume">
      <div className="resume-container">
        <h2><i className="fas fa-file-alt"></i> Resume</h2>
        <a href="/Deepak_Resume.pdf" download>
          <i className="fas fa-download"></i> Download My Resume
        </a>
      </div>
    </section>
  );
}
