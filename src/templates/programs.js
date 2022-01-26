import React from "react";
import {graphql} from 'gatsby';
import MainLayout from "../layouts/MainLayout";
import { useIntl } from "gatsby-plugin-intl";
import EventsList from "../components/EventsList/EventsList";

const Programs = ({data, pageContext}) => {
    const intl = useIntl();
    let posts = {};
    if(intl.locale === 'es') {
        posts = data.allWpPost.nodes;
      } else if(intl.locale === 'ge') {
        posts = data.allWpPost.nodes;
    }
    return ( 
        <MainLayout>
            <EventsList 
                posts={posts}
                pageContext={pageContext}
            />
        </MainLayout>
     );
}
 
export default Programs ;
export const query = graphql`
query($skip: Int!, $limit: Int!, $language: String) {
    allWpPost(
    filter: {tags: {nodes: {elemMatch: {name: {eq: $language}}}}, categories: {nodes: {elemMatch: {name: {eq: "programs"}}}}}
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