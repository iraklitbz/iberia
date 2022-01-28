import React, { useEffect } from "react";
import {graphql} from 'gatsby';
import MainLayout from "../../layouts/MainLayout";
import BlogList from "../../components/BlogList/BlogList";
import { navigate, useIntl } from "gatsby-plugin-intl";
import SEO from "../../components/seo";

const News = ({data, pageContext}) => {

    const {language} = pageContext;
    const intl = useIntl();
    useEffect(() => {
        if(language === 'es' && intl.originalPath === intl.originalPath) {
            navigate('/news')
          } 
    },[])
    
    return ( 
        <MainLayout>
             <SEO
                lang={intl.locale}
                title={intl.formatMessage({ id: "titlenews" })}
                keywords={[`iberia`, `news`, `georgia`]}
            />
                    
            <BlogList 
                posts={data.allWpNew.nodes}
                pageContext={pageContext}
            />
        </MainLayout>
     );
}
 
export default News ;
export const query = graphql`
query($skip: Int!, $limit: Int!) {
  allWpNew(
    filter: {geocategories: {nodes: {elemMatch: {name: {eq: "სიახლე"}}}}}
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