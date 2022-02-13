import React from "react";
import { useIntl, Link } from "gatsby-plugin-intl";
const Footer = () => {
  const intl = useIntl();
  return ( 
    <footer className="main-footer position-relative z-index-1 padding-top-xl">
    <div className="container max-width-lg">
      <div className="grid gap-lg">
        <div className="col-3@lg order-2@lg text-right@lg">
          <Link to="/" className="f-header__logo normal-logo">
                <div className="small-logo-icon">
                  <img width="45px" height="45px" src="https://iberiainfo.me/wp-content/uploads/2022/02/logo_iberia_icon.svg" />
                </div>
                <div className="logo-name">
                  <img width="120px" height="36px" src="https://iberiainfo.me/wp-content/uploads/2022/02/logo_iberia_text-1.svg" />
                </div>
            </Link>
        </div>
        
        <nav className="col-9@lg order-1@lg">
          <ul className="grid gap-lg">
           
  
            <li className="col-6@xs col-3@md">
              <h4 className="margin-bottom-sm">Mapa de web</h4>
              <ul className="grid gap-xs">
                <li className="f-header__item"><Link to="/">{intl.formatMessage({ id: "home" })}</Link></li>
                <li className="f-header__item"><Link to="/about">{intl.formatMessage({ id: "aboutus" })}</Link></li>
                <li className="f-header__item"><Link to="/service">{intl.formatMessage({ id: "service" })}</Link></li>
                <li className="f-header__item"><Link to="/contact">{intl.formatMessage({ id: "contactus" })}</Link></li>
              </ul>
            </li>

            <li className="col-6@xs col-3@md">
              <h4 className="margin-bottom-sm">Noticias</h4>
             
              {intl.locale === 'es' 
              ?
              <ul className="grid gap-xs">
                  <li><Link to="/news">{intl.formatMessage({ id: "news" })}</Link></li>
                  <li><Link to="/events">{intl.formatMessage({ id: "events" })}</Link></li>
                  <li><Link to="/activities">{intl.formatMessage({ id: "activities" })}</Link></li>
                  <li><Link to="/programs">{intl.formatMessage({ id: "programs" })}</Link></li>
                <li><Link to="/tours">{intl.formatMessage({ id: "tours" })}</Link></li>
                </ul>
                :
                <ul className="grid gap-xs">
                  <li><Link to="/news-ge">{intl.formatMessage({ id: "news" })}</Link></li>
                  <li><Link to="/events-ge">{intl.formatMessage({ id: "events" })}</Link></li>
                  <li><Link to="/activities-ge">{intl.formatMessage({ id: "activities" })}</Link></li>
                  <li><Link to="/programs-ge">{intl.formatMessage({ id: "programs" })}</Link></li>
                  <li><Link to="/tours-ge">{intl.formatMessage({ id: "tours" })}</Link></li>
                </ul>
              }
             
            </li>
  
            <li className="col-6@xs col-3@md">
              <h4 className="margin-bottom-sm">{intl.formatMessage({ id: "footer" })}:</h4>
              <ul className="grid gap-xs social-net">
                <li><Link to="#0" className="main-footer__link"><i className="bx-pull-left bx bxl-facebook bx-sm"></i> Facebook </Link></li>
                <li><Link to="#0" className="main-footer__link"><i className="bx-pull-left bx bxl-twitter  bx-sm"></i> Twitter</Link></li>
                <li><Link to="#0" className="main-footer__link"><i className="bx-pull-left bx bxl-youtube bx-sm"></i> Youtube</Link></li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    
      <div className="flex flex-column border-top padding-y-xs margin-top-lg flex-row@md justify-between@md items-center@md">
        <div className="margin-bottom-sm margin-bottom-0@md">
          <div className="text-sm text-xs@md color-contrast-medium flex flex-wrap gap-xs">
            <span>&copy; iberiainfo.org</span>
            <a href="#0" className="color-contrast-high">Política de privacidad</a>
            <a href="#0" className="color-contrast-high">Política de cookies</a>
          </div>
        </div>
  
        <div className="flex items-center gap-xs">
          <a href="#0" className="main-footer__social">
            <svg className="icon block" viewBox="0 0 16 16"><title>Follow us on Twitter</title><g><path d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z"></path></g></svg>
          </a>
  
          <a href="#0" className="main-footer__social">
            <svg className="icon block" viewBox="0 0 16 16"><title>Follow us on Youtube</title><g><path d="M15.8,4.8c-0.2-1.3-0.8-2.2-2.2-2.4C11.4,2,8,2,8,2S4.6,2,2.4,2.4C1,2.6,0.3,3.5,0.2,4.8C0,6.1,0,8,0,8 s0,1.9,0.2,3.2c0.2,1.3,0.8,2.2,2.2,2.4C4.6,14,8,14,8,14s3.4,0,5.6-0.4c1.4-0.3,2-1.1,2.2-2.4C16,9.9,16,8,16,8S16,6.1,15.8,4.8z M6,11V5l5,3L6,11z"></path></g></svg>
          </a>
  
          <a href="#0" className="main-footer__social">
            <svg className="icon block" viewBox="0 0 16 16"><title>Follow us on Github</title><g><path  d="M8,0.2c-4.4,0-8,3.6-8,8c0,3.5,2.3,6.5,5.5,7.6 C5.9,15.9,6,15.6,6,15.4c0-0.2,0-0.7,0-1.4C3.8,14.5,3.3,13,3.3,13c-0.4-0.9-0.9-1.2-0.9-1.2c-0.7-0.5,0.1-0.5,0.1-0.5 c0.8,0.1,1.2,0.8,1.2,0.8C4.4,13.4,5.6,13,6,12.8c0.1-0.5,0.3-0.9,0.5-1.1c-1.8-0.2-3.6-0.9-3.6-4c0-0.9,0.3-1.6,0.8-2.1 c-0.1-0.2-0.4-1,0.1-2.1c0,0,0.7-0.2,2.2,0.8c0.6-0.2,1.3-0.3,2-0.3c0.7,0,1.4,0.1,2,0.3c1.5-1,2.2-0.8,2.2-0.8 c0.4,1.1,0.2,1.9,0.1,2.1c0.5,0.6,0.8,1.3,0.8,2.1c0,3.1-1.9,3.7-3.7,3.9C9.7,12,10,12.5,10,13.2c0,1.1,0,1.9,0,2.2 c0,0.2,0.1,0.5,0.6,0.4c3.2-1.1,5.5-4.1,5.5-7.6C16,3.8,12.4,0.2,8,0.2z"></path></g></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
   );
}
 
export default Footer;