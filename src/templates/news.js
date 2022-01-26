import React from "react";
import {graphql} from 'gatsby';
import MainLayout from "../layouts/MainLayout";
import BlogList from "../components/BlogList/BlogList";

const News = ({data, pageContext}) => {
    return ( 
        <MainLayout>
            
            <BlogList 
                posts={data.allWpPost.nodes}
                pageContext={pageContext}
            />
        </MainLayout>
     );
}
 
export default News ;
export const query = graphql`
query($skip: Int!, $limit: Int!, $locale: String) {
    allWpPost(
        filter: {tags: {nodes: {elemMatch: {name: {eq: $locale}}}}, categories: {nodes: {elemMatch: {name: {eq: "news"}}}}}
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
        tags {
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