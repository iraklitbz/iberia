import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { css, Global } from '@emotion/react';
import { useIntl } from "gatsby-plugin-intl";
import Helmet from "react-helmet"
import { withPrefix, Link } from "gatsby"
import { useEffect } from "react";

    


const MainLayout = ({children, className}) => {
  const intl = useIntl();
  useEffect(() => {
    document.getElementsByTagName("html")[0].className += " js";
  }, []);
  return ( 
      <div className={`main ${className || ''}`}> 
       <Helmet>
        <script src={withPrefix('Util.js')} type="text/javascript" />
       </Helmet>

        { intl.locale === 'en' ? 
          <Global styles={css`
              :root {
                --font-primary: 'Montserrat', sans-serif;
              }
          `} /> 
          
          :  
          <Global styles={css`
            :root {
              --font-primary: 'Noto Serif Georgian', serif;
            }
          `} /> 
        }
          
        
        <Header />
        { children }
        <Footer />
    </div>
   );
}
 
export default MainLayout;