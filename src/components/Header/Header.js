import React, {useState, useEffect} from "react";
import { useIntl, Link } from "gatsby-plugin-intl";
import Language from "./Language";
const Header = ({isPost}) => {
  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrollOK, setIsScrollOK] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    const onScroll = e => {
      setScrollTop(e.target.documentElement.scrollTop);
      
      setScrolling(e.target.documentElement.scrollTop > scrollTop);
        };
        window.addEventListener("scroll", onScroll);
      if(scrollTop > 150) {
        setIsScrollOK(true)
      } else {
        setIsScrollOK(false)
      }

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  return ( 
    <header className="f-header js-f-header position-fixed">
      <div className="f-header__mobile-content container max-width-lg">
        <Link className={isScrollOK ? 'f-header__logo active' : 'f-header__logo'} to="/">
            <div className="small-logo-icon">
                  <img width="45px"  src="https://iberiainfo.me/wp-content/uploads/2022/02/logo_iberia_icon.svg" />
                </div>
                <div className="logo-name">
                  <img width="120px" height="36px" src="https://iberiainfo.me/wp-content/uploads/2022/02/logo_iberia_text-1.svg" />
              </div>
        </Link>

        <button className="reset anim-menu-btn js-anim-menu-btn f-header__nav-control js-tab-focus" aria-label="Toggle menu">
          <i className="anim-menu-btn__icon anim-menu-btn__icon--close" aria-hidden="true"></i>
        </button>
      </div>

      <div className="f-header__nav" role="navigation">
        <div className="f-header__nav-grid justify-between@md container max-width-lg">
          <div className={isScrollOK ? 'f-header__nav-logo-wrapper flex-grow flex-basis-0 active' : 'f-header__nav-logo-wrapper flex-grow flex-basis-0'}>
            <Link to="/" className="f-header__logo">
                <div className="small-logo-icon">
                  <img width="45px"  src="https://iberiainfo.me/wp-content/uploads/2022/02/logo_iberia_icon.svg" />
                </div>
                <div className="logo-name">
                  <img width="120px" height="36px" src="https://iberiainfo.me/wp-content/uploads/2022/02/logo_iberia_text-1.svg" />
                </div>
            </Link>
          </div>

          <ul className="f-header__list navbar-menu-primary ">
              <li className="f-header__item"><Link to="/" className="f-header__link">{intl.formatMessage({ id: "home" })}</Link></li>
              {intl.locale === 'es' 
              ? 
              <li className="f-header__item"><Link to={`/news`} className="f-header__link">
                  <span>{intl.formatMessage({ id: "news" })}</span>
                  <svg className="f-header__dropdown-icon icon" aria-hidden="true" viewBox="0 0 12 12">
                    <path d="M9.943,4.269A.5.5,0,0,0,9.5,4h-7a.5.5,0,0,0-.41.787l3.5,5a.5.5,0,0,0,.82,0l3.5-5A.5.5,0,0,0,9.943,4.269Z" />
                  </svg>
                </Link>

                  <ul className="f-header__dropdown">
                        <li><Link to="/news" className="f-header__dropdown-link">{intl.formatMessage({ id: "news" })}</Link></li>
                        <li><Link to="/events" className="f-header__dropdown-link">{intl.formatMessage({ id: "events" })}</Link></li>
                        <li><Link to="/activities" className="f-header__dropdown-link">{intl.formatMessage({ id: "activities" })}</Link></li>
                        <li><Link to="/programs" className="f-header__dropdown-link">{intl.formatMessage({ id: "programs" })}</Link></li>
                        <li><Link to="/tours" className="f-header__dropdown-link">{intl.formatMessage({ id: "tours" })}</Link></li>
                      </ul>
                    </li>
                    : 
                    <li className="f-header__item"><Link to={`/news-ge`} className="f-header__link">
                    <span>{intl.formatMessage({ id: "news" })}</span>
                    <svg className="f-header__dropdown-icon icon" aria-hidden="true" viewBox="0 0 12 12">
                      <path d="M9.943,4.269A.5.5,0,0,0,9.5,4h-7a.5.5,0,0,0-.41.787l3.5,5a.5.5,0,0,0,.82,0l3.5-5A.5.5,0,0,0,9.943,4.269Z" />
                    </svg>
                  </Link>

                  <ul className="f-header__dropdown">
                    <li><Link to="/news-ge" className="f-header__dropdown-link">{intl.formatMessage({ id: "news" })}</Link></li>
                    <li><Link to="/events-ge" className="f-header__dropdown-link">{intl.formatMessage({ id: "events" })}</Link></li>
                    <li><Link to="/activities-ge" className="f-header__dropdown-link">{intl.formatMessage({ id: "activities" })}</Link></li>
                    <li><Link to="/programs-ge" className="f-header__dropdown-link">{intl.formatMessage({ id: "programs" })}</Link></li>
                    <li><Link to="/tours-ge" className="f-header__dropdown-link">{intl.formatMessage({ id: "tours" })}</Link></li>
                  </ul>
                </li>
              
              }
              <li className="f-header__item"><Link to="/about" className="f-header__link">{intl.formatMessage({ id: "aboutus" })}</Link></li>
              <li className="f-header__item"><Link to="/service" className="f-header__link">{intl.formatMessage({ id: "service" })}</Link></li>
              <li className="f-header__item"><Link to="/contact" className="f-header__link">{intl.formatMessage({ id: "contactus" })}</Link></li>
            </ul>
            {!isPost ? <Language /> : null}
            
         </div>
        </div>
 
    </header>
   );
}
 
export default Header;

