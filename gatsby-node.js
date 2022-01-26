const path = require(`path`)
const { slash } = require(`gatsby-core-utils`)
const { paginate } = require('gatsby-awesome-pagination');

// Implement the Gatsby API “createPages”. This is
// called after the Gatsby bootstrap is finished so you have
// access to any information necessary to programmatically
// create pages.
// Will create pages for WordPress pages (route : /{slug})
// Will create pages for WordPress posts (route : /post/{slug})
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // The “graphql” function allows us to run arbitrary
  // queries against the local Gatsby GraphQL schema. Think of
  // it like the site has a built-in database constructed
  // from the fetched data that you can run queries against.
  const result = await graphql(`
      query getPost {
        allWpPost {
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
  `)
  

  // Check for any errors
  if (result.errors) {
    throw new Error(result.errors)
  }

   // Create your paginated events
   paginate({
    createPage,
    items: result.data.allWpPost.nodes,
    itemsPerPage: 4, // How many items you want per page
    pathPrefix: '/events', // Creates pages like `/blog`, `/blog/2`, etc
    component: path.resolve(`src/templates/events.js`), // Just like `createPage()`
  });

  result.data.allWpPost.nodes.forEach(element => {
    createPage({
      path: `/${element.slug}`,
      component: path.resolve(`src/templates/post.js`),
      context: {
        data: element
      }
    })
  });

   // Create your paginated actividades
   paginate({
    createPage,
    items: result.data.allWpPost.nodes,
    itemsPerPage: 4, // How many items you want per page
    pathPrefix: '/activities', // Creates pages like `/blog`, `/blog/2`, etc
    component: path.resolve(`src/templates/activities.js`), // Just like `createPage()`
  });

  result.data.allWpPost.nodes.forEach(element => {
    createPage({
      path: `/${element.slug}`,
      component: path.resolve(`src/templates/post.js`),
      context: {
        data: element
      }
    })
  });

   // Create your paginated news
   paginate({
    createPage,
    items: result.data.allWpPost.nodes,
    itemsPerPage: 4, // How many items you want per page
    pathPrefix: '/news', // Creates pages like `/blog`, `/blog/2`, etc
    component: path.resolve(`src/templates/news.js`), // Just like `createPage()`
  });

  result.data.allWpPost.nodes.forEach(element => {
    createPage({
      path: `/${element.slug}`,
      component: path.resolve(`src/templates/post.js`),
      context: {
        data: element,
         language,
      }
    })
  });

   // Create your paginated programs
   paginate({
    createPage,
    items: result.data.allWpPost.nodes,
    itemsPerPage: 4, // How many items you want per page
    pathPrefix: '/programs', // Creates pages like `/blog`, `/blog/2`, etc
    component: path.resolve(`src/templates/programs.js`), // Just like `createPage()`
  });

  result.data.allWpPost.nodes.forEach(element => {
    createPage({
      path: `/${element.slug}`,
      component: path.resolve(`src/templates/post.js`),
      context: {
        data: element
      }
    })
  });

   // Create your paginated tours
   paginate({
    createPage,
    items: result.data.allWpPost.nodes,
    itemsPerPage: 4, // How many items you want per page
    pathPrefix: '/tours', // Creates pages like `/blog`, `/blog/2`, etc
    component: path.resolve(`src/templates/tours.js`), // Just like `createPage()`
  });

  result.data.allWpPost.nodes.forEach(element => {
    createPage({
      path: `/${element.slug}`,
      component: path.resolve(`src/templates/post.js`),
      context: {
        data: element
      }
    })
  });
}


 
