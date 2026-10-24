const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="container footer-inner">
        <div>
          <span className="footer-brand">NovaMart</span>
          <p className="footer-copy">
            © {new Date().getFullYear()} NovaMart. All rights reserved.
          </p>
        </div>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
