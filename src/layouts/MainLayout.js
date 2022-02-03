import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { css, Global } from '@emotion/react';
import { useIntl } from "gatsby-plugin-intl";
import Helmet from "react-helmet"
import { withPrefix } from "gatsby"
import { useEffect } from "react";

    


const MainLayout = ({children, className, isPost}) => {


  const intl = useIntl();
  useEffect(() => {
    if(!document.getElementsByTagName("html")[0].classList.contains('js'))
    document.getElementsByTagName("html")[0].className += " js";
  }, []);

  useEffect(() => {
    if(intl.locale === 'es') {
      document.getElementsByTagName("body")[0].classList.remove("ge");
      document.getElementsByTagName("body")[0].className += " es";
      
    } else if (intl.locale === 'ge') {
      document.getElementsByTagName("body")[0].classList.remove("es");
      document.getElementsByTagName("body")[0].className += " ge";
      
    } 

  }, [intl.locale]);
  return ( 
    
      <div className={`main ${className || ''}`}> 
       <Helmet>
        <script src={withPrefix('Util.js')} type="text/javascript" />
       </Helmet>

        { intl.locale === 'es' ? 
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
          
        
        <Header isPost={isPost} />
          { children }
        <Footer />
    </div>
   );
}
 
export default MainLayout;