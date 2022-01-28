import React, { useEffect } from "react";
import {graphql, navigate} from 'gatsby';
import MainLayout from "../layouts/MainLayout";
import BlogList from "../components/BlogList/BlogList";
import { useIntl } from "gatsby-plugin-intl";
import SEO from "../components/seo";

const News = ({data, pageContext}) => {
    const {language} = pageContext;
    const intl = useIntl();
    useEffect(() => {
        if(language === 'ge' && intl.originalPath === intl.originalPath) {
            navigate('/news-ge')
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
                posts={data.allWpPost.nodes}
                pageContext={pageContext}
            />
        </MainLayout>
     );
}
 
export default News ;
export const query = graphql`
query($skip: Int!, $limit: Int!) {
    allWpPost(
        filter: {categories: {nodes: {elemMatch: {name: {eq: "news"}}}}}
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
        categories {
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