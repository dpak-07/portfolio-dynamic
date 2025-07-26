// src/components/LoadingScreen.jsx
export default function LoadingScreen() {
  return (
    <div id="loading-screen">
      <div className="spinner"></div>
      <h1 className="loading-text">Loading<span className="dots"></span></h1>
    </div>
  );
}
