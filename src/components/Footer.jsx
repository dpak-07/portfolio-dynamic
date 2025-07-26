// src/components/Footer.jsx
export default function Footer() {
  const copyEmail = () => {
    navigator.clipboard.writeText("deepakofficail0103@gmail.com").then(() => {
      const notification = document.getElementById("copy-notification");
      notification.style.opacity = "1";
      setTimeout(() => {
        notification.style.opacity = "0";
      }, 2000);
    });
  };

  return (
    <footer>
      <div className="footer-container">
        <h2><i className="fas fa-envelope"></i> Contact</h2>
        <p>
          <i className="fas fa-envelope"></i>
          <span id="email" onClick={copyEmail}>deepakofficail0103@gmail.com</span>
        </p>
        <p><i className="fas fa-phone"></i> Phone: 6369021716</p>

        <div className="social-links">
          <a href="https://github.com/Deepak-S-github" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i> GitHub
          </a>
          <a href="https://www.linkedin.com/in/deepak-saminathan/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
          <a href="https://www.instagram.com/d.pak_07/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i> Instagram
          </a>
        </div>

        <p>&copy; 2024 Deepak S. All rights reserved.</p>
        <div id="copy-notification">Copied!</div>
      </div>
    </footer>
  );
}
