const path = require(`path`)
const { paginate } = require('gatsby-awesome-pagination');

// pages locale
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  deletePage(page)
  // You can access the variable "locale" in your page queries now
  createPage({
      ...page,
      context: {
          ...page.context,
          locale: page.context.intl.language,
      },
  })
}


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
          }
        }
      }
  `);

  const postsgeo = await graphql(`
      query getPost {
        allWpNew {
          nodes {
            id
            title
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
          }
        }
      }
  `);
  

  // Check for any errors
  if (result.errors) {
    throw new Error(result.errors)
  }

   // Create your paginated events
   paginate(
    {
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
        data: element
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



     // Georgian
     paginate(
      {
      createPage,
      items: postsgeo.data.allWpNew.nodes,
      itemsPerPage: 4, // How many items you want per page
      pathPrefix: '/events', // Creates pages like `/blog`, `/blog/2`, etc
      component: path.resolve(`src/templates/events.js`), // Just like `createPage()`
    });
  
    postsgeo.data.allWpNew.nodes.forEach(element => {
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
      items: postsgeo.data.allWpNew.nodes,
      itemsPerPage: 4, // How many items you want per page
      pathPrefix: '/activities', // Creates pages like `/blog`, `/blog/2`, etc
      component: path.resolve(`src/templates/activities.js`), // Just like `createPage()`
    });
  
    postsgeo.data.allWpNew.nodes.forEach(element => {
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
      items: postsgeo.data.allWpNew.nodes,
      itemsPerPage: 4, // How many items you want per page
      pathPrefix: '/news', // Creates pages like `/blog`, `/blog/2`, etc
      component: path.resolve(`src/templates/news.js`), // Just like `createPage()`
    });
  
    postsgeo.data.allWpNew.nodes.forEach(element => {
      createPage({
        path: `/${element.slug}`,
        component: path.resolve(`src/templates/post.js`),
        context: {
          data: element
        }
      })
    });
  
     // Create your paginated programs
     paginate({
      createPage,
      items: postsgeo.data.allWpNew.nodes,
      itemsPerPage: 4, // How many items you want per page
      pathPrefix: '/programs', // Creates pages like `/blog`, `/blog/2`, etc
      component: path.resolve(`src/templates/programs.js`), // Just like `createPage()`
    });
  
    postsgeo.data.allWpNew.nodes.forEach(element => {
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
      items: postsgeo.data.allWpNew.nodes,
      itemsPerPage: 4, // How many items you want per page
      pathPrefix: '/tours', // Creates pages like `/blog`, `/blog/2`, etc
      component: path.resolve(`src/templates/tours.js`), // Just like `createPage()`
    });
  
    postsgeo.data.allWpNew.nodes.forEach(element => {
      createPage({
        path: `/${element.slug}`,
        component: path.resolve(`src/templates/post.js`),
        context: {
          data: element
        }
      })
    });

  
}


 
/* in georgian*/

