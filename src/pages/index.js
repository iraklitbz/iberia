import React from "react";
import {graphql, useStaticQuery} from 'gatsby';
import MainLayout from "../layouts/MainLayout";
import Hero from "../components/Hero/Hero";
import HomeList from "../components/HomeList/HomeList";
import { useIntl, FormattedHTMLMessage } from "gatsby-plugin-intl";
const IndexPage = () => {
  let posts = {};
  const intl = useIntl();
  const data = useStaticQuery(graphql`
    query HomeQuery {
        allWpPost(
          filter: {categories: {nodes: {elemMatch: {name: {eq: "home"}}}}}
          ) {
              nodes {
                  id
                  title
                  date
                  content
                  featuredImage{
                      node {
                        sourceUrl
                      }
                    }
                  categories {
                      nodes {
                          name
                      }
                  }
            
                  slug
                  excerpt
              }
        }
      allWpNew(
        filter: {geocategories: {nodes: {elemMatch: {name: {eq: "home"}}}}}
        ) {
            nodes {
                id
                title
                date
                content
                featuredImage{
                    node {
                      sourceUrl
                    }
                  }
                  geocategories {
                    nodes {
                        name
                    }
                }
          
                slug
                excerpt
            }
      }
    }
  ` )
    if(intl.locale === 'es') {
      posts = data.allWpPost.nodes;
    } else if(intl.locale === 'ge') {
      posts = data.allWpNew.nodes;
    }
  return (
   <MainLayout>
     <Hero />
     <HomeList posts={posts} />
     <section className="position-relative z-index-1 margin-y-lg">
        <div className="container max-width-adaptive-lg">
          <div className="bg-iberia inner-glow shadow-md radius-lg">
            <div className="grid">
              <div className="flex items-center col-6@md">
                <div className="padding-md padding-x-lg@lg padding-y-lg@lg">
          
                  <div className="text-component">
                    <h2 className="special-headline"><FormattedHTMLMessage id="home5" /></h2>
                    <p>{intl.formatMessage({ id: "home6" })}</p>
                  </div>
        
                  <div className="margin-top-lg">
                  <ol className="list-v2 list-v2--icons">
                    <li>
                      <div className="margin-bottom-xs">
                        <h3 className="list-v2__title">
                          <figure className="list-v2__bullet" aria-hidden="true">
                            <i className='bx-pull-left bx bxs-quote-alt-left bx-lg'/>
                          </figure>{intl.formatMessage({ id: "home7" })}
                        </h3>
                      </div>
                    </li>
                    <li>
                      <div>
                        <h3 className="list-v2__title">
                          <figure className="list-v2__bullet" aria-hidden="true">
                          <i className='bx-pull-left bx bxs-quote-alt-left bx-lg'/>
                          </figure>{intl.formatMessage({ id: "home8" })}
                        </h3>
                      </div>
                    </li>
                    </ol>
                  </div>
                </div>
              </div>
        
              <figure className="col-6@md">
                <img className="block width-100% height-100% object-cover" src="https://iberiainfo.me/wp-content/uploads/2022/02/abstract5-scaled.jpg" alt="imagen universidad" />
              </figure>
            </div>
          </div>
        </div>
    </section>
    
    <section className="bg-iberia position-relative z-index-1 margin-y-xl">
      <div className="container max-width-adaptive-lg padding-y-xl">
         <h2 className="text-center">{intl.formatMessage({ id: "home9" })}</h2>
         <div className="margin-top-lg">
           <ul className="flex flex-wrap gap-lg flex-center logo-banners">
              <li><img src="https://iberiainfo.me/wp-content/uploads/2022/02/abstract5-scaled.jpg" alt="logo universidad burgos" /></li>
              <li><img src="https://iberiainfo.me/wp-content/uploads/2022/02/abstract5-scaled.jpg" alt="logo universidad" /></li>
              <li><img src="https://iberiainfo.me/wp-content/uploads/2022/02/abstract5-scaled.jpg" alt="imagen universidad" /></li>
              <li><img src="https://iberiainfo.me/wp-content/uploads/2022/02/abstract5-scaled.jpg" alt="imagen universidad" /></li>
              <li><img src="https://iberiainfo.me/wp-content/uploads/2022/02/abstract5-scaled.jpg" alt="imagen universidad" /></li>
              <li><img src="https://iberiainfo.me/wp-content/uploads/2022/02/abstract5-scaled.jpg" alt="imagen universidad" /></li>

           </ul>
         </div>

      </div>
      <figure className="scribble-bg z-index-1" aria-hidden="true">
          <svg className="scribble-bg__svg top-0 left-50% -translate-x-50% color-iberia opacity-10%" viewBox="0 0 1920 590">
            <path d="M1570.136-28.171a296.432,296.432,0,0,0-139.013,47.223c-8.543,5.586-17.143,12.022-21.447,21.278-12.109,26.04,15.492,52.716,40.9,66.107A427.5,427.5,0,0,0,1675.691,154.6c13.455-.856,30.982-6.965,29.743-20.391-.442-4.791-3.464-8.93-6.688-12.5-19.853-22-49.8-31.446-78.524-38.729A1038.856,1038.856,0,0,0,1298.356,53.34c-30.952,2.006-64.567,6.682-86.069,29.036-6.951,7.226-12.359,16.383-13.212,26.374-1.456,17.046,10.2,32.259,22.237,44.416,57.314,57.885,139.625,90.126,221.006,86.568,8.59-.376,18.34-1.777,23.193-8.875,2.913-4.261,3.365-9.727,3.158-14.885-1.735-43.255-41.445-74.975-80.731-93.158C1299.537,81.9,1198.378,78.458,1101.3,86.5c-59.081,4.9-127.107,20.2-152.692,73.68-16.807,35.13-9.123,78.38,11.7,111.289s53.051,56.961,86.528,76.859a585.874,585.874,0,0,0,267.322,81.052c33.049,1.737,72.383-2.809,88.468-31.731,18.37-33.031-6.6-73.365-34.008-99.389C1259.887,195.022,1102.135,161.009,952.24,157.372c-50.1-1.215-100.438.48-149.834,8.924-31.1,5.316-62.395,13.581-88.693,31.017s-47.126,45.349-49.616,76.8c-1.85,23.377,6.442,46.637,18.805,66.564,34.888,56.229,98.88,87.176,161.743,107.843,94.343,31.018,200.04,44.841,291.328,5.736,33.089-14.175,65.944-38.954,71.721-74.484,7.219-44.4-30.245-83.155-68-107.609-61.524-39.846-131.951-64.07-203.247-81.088-132.917-31.728-276.168-38.8-403.5,10.8-63.1,24.58-127.428,73.7-128.884,141.4-.777,36.077,17.176,70.4,41.051,97.455,65.044,73.717,168.4,99.363,266.055,110.735a1393.154,1393.154,0,0,0,165.288,9.343c50.438-.152,110.582-9.136,132.182-54.714,14.851-31.337,4.239-70.234-18.1-96.763s-54.359-42.844-86.444-56C796.1,309.044,678.455,293,561.812,288.53c-86.123-3.3-175.168.086-253.694,35.606-41.442,18.745-81.615,50.115-91.428,94.528-9.969,45.113,15.306,92.609,52.451,120.083s84.016,38.2,129.918,43.454a665.052,665.052,0,0,0,164.374-1.663" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5" strokeDasharray="7296" />
          </svg>
        </figure>
    </section>
   </MainLayout>
  )
}

export default IndexPage
