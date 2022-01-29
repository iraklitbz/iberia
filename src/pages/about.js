import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useIntl, Link, FormattedHTMLMessage } from "gatsby-plugin-intl";
const AboutUs = () => {
  const intl = useIntl();
  return (
   <MainLayout>
      <section className="position-relative z-index-1 padding-y-xl">
          <div className="container max-width-adaptive-md">
            <div className="margin-bottom-xl">
              <h1 className="text-center">{intl.formatMessage({ id: "aboutus" })}</h1>
            </div>

            <ol className="hiw-list">
              <li className="hiw-list__item">
                <div className="hiw-list__item-inner">
                  <div className="hiw-list__counter" aria-hidden="true"></div>
          
                  <div className="flex-grow">
                    <div className="hiw-list__content grid gap-md items-center@md">
                      <figure className="col-6@md">
                        <img className="block width-100%" src="https://codyhouse.co/app/assets/img/how-it-works-img-1.png"  />
                      </figure>
              
                      <div className="col-6@md">
                        <div className="text-component">
            
                          <p className="color-contrast-medium"><FormattedHTMLMessage id="aboutus1_html" /></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="hiw-list__item">
                <div className="hiw-list__item-inner">
                  <div className="hiw-list__counter" aria-hidden="true"></div>
          
                  <div className="flex-grow">
                    <div className="hiw-list__content grid gap-md items-center@md">
                      <figure className="col-6@md">
                        <img className="block width-100%" src="https://codyhouse.co/app/assets/img/how-it-works-img-2.png"  />
                      </figure>
              
                      <div className="col-6@md">
                        <div className="text-component">
            
                          <p className="color-contrast-medium"><FormattedHTMLMessage id="aboutus2" />.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="hiw-list__item">
                <div className="hiw-list__item-inner">
                  <div className="hiw-list__counter" aria-hidden="true"></div>
          
                  <div className="flex-grow">
                    <div className="hiw-list__content grid gap-md items-center@md">
                      <figure className="col-6@md">
                        <img className="block width-100%" src="https://codyhouse.co/app/assets/img/how-it-works-img-3.png"  />
                      </figure>
              
                      <div className="col-6@md">
                        <div className="text-component">
                      
                          <p className="color-contrast-medium"><FormattedHTMLMessage id="aboutus3_html" /></p>
                        </div>

                        <div className="margin-top-md">
                          <Link className="btn btn--primary" to="/contact">{intl.formatMessage({ id: "contactus" })}</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </section>
   </MainLayout>
  )
}

export default AboutUs
