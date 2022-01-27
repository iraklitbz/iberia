import React from "react";
import {graphql} from 'gatsby';
import MainLayout from "../layouts/MainLayout";
import BlogList from "../components/BlogList/BlogList";
import { useIntl } from "gatsby-plugin-intl";

const News = ({data, pageContext}) => {
    const intl = useIntl();
    let posts = {};

    if(intl.locale === 'es') {
      posts = data.allWpPost.nodes;
    } else if(intl.locale === 'ge') {
      posts = data.allWpNew.nodes;
    }
    return ( 
        <MainLayout>
            
            <BlogList 
                posts={posts}
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