// src/components/TechStack.jsx
export default function TechStack() {
  return (
    <section id="tech-stack">
      <h2><i className="fas fa-tools"></i> Tech Stack</h2>
      <div className="tech-columns">
        <div className="frontend">
          <h3><i className="fas fa-laptop-code"></i> Frontend</h3>
          <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
            <li>React.js</li>
          </ul>
        </div>
        <div className="backend">
          <h3><i className="fas fa-server"></i> Backend</h3>
          <ul>
            <li>Node.js</li>
            <li>Flask</li>
            <li>MongoDB</li>
            <li>MySQL</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
