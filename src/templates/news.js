import React from "react";
import {graphql} from 'gatsby';
import MainLayout from "../layouts/MainLayout";
import { useIntl } from "gatsby-plugin-intl";
import BlogList from "../components/BlogList/BlogList";

const News = ({data, pageContext}) => {
    const intl = useIntl();
    let posts = {};
    if(intl.locale === 'es') {
        posts = data.allWpPost.nodes;
      } else if(intl.locale === 'ge') {
        posts = data.allWpPost.nodes;
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
query($skip: Int!, $limit: Int!, $language: String) {
    allWpPost(
        filter: {tags: {nodes: {elemMatch: {name: {eq: $language}}}}, categories: {nodes: {elemMatch: {name: {eq: "news"}}}}}
    skip: $skip
    limit: $limit
    ) {
    nodes {
        id
        title
        categories {
            nodes {
                name
            }
        }
        tags {
            nodes {
                name
            }
        }
        slug
    }
  }


  
}
`