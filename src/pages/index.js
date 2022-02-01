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
        <div className="bg-light inner-glow shadow-md radius-lg" data-theme="dark">
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
                          <img width="45px" src="//cms.iberiainfo.org/wp-content/uploads/2022/01/logo_iberia_icon.svg" />
                        </figure>{intl.formatMessage({ id: "home7" })}
                      </h3>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3 className="list-v2__title">
                        <figure className="list-v2__bullet" aria-hidden="true">
                          <img width="45px" src="//cms.iberiainfo.org/wp-content/uploads/2022/01/logo_iberia_icon.svg" />
                        </figure>{intl.formatMessage({ id: "home8" })}
                      </h3>
                    </div>
                  </li>
                  </ol>
                </div>
              </div>
            </div>
      
            <figure className="col-6@md">
              <img className="block width-100% height-100% object-cover" src="//cms.iberiainfo.org/wp-content/uploads/2022/02/drahomir-posteby-mach-n4y3eiQSIoc-unsplash-scaled.jpg" alt="imagen universidad" />
            </figure>
          </div>
        </div>
      </div>
    </section>
   </MainLayout>
  )
}

export default IndexPage
