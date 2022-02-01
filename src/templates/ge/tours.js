import React from "react";
import {graphql} from 'gatsby';
import MainLayout from "../../layouts/MainLayout";
import EventsList from "../../components/EventsList/EventsList";
import { useIntl } from "gatsby-plugin-intl";
import SEO from "../../components/seo";


const Tours = ({data, pageContext}) => {
    const intl = useIntl();
    return ( 
        <MainLayout>
             <SEO
                lang={intl.locale}
                title={intl.formatMessage({ id: "titlenews" })}
                keywords={[`iberia`, `news`, `georgia`]}
            />
                    
            <EventsList 
                posts={data.allWpNew.nodes}
                pageContext={pageContext}
            />
        </MainLayout>
     );
}
 
export default Tours ;
export const query = graphql`
query($skip: Int!, $limit: Int!) {
    allWpNew(
    filter: {geocategories: {nodes: {elemMatch: {name: {eq: "tours"}}}}}
    skip: $skip
    limit: $limit
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
`