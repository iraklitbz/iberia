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
  const { createPage, createRedirect } = actions;
  const categorias = ['events', 'activities', 'news', 'programs', 'tours'];
  const categoriasgeo = ['events-ge', 'activities-ge', 'news-ge', 'programs-ge', 'tours-ge'];
 

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

  

  categorias.forEach(async element => {
    paginate(
      {
      createPage,
      items: result.data.allWpPost.nodes,
      itemsPerPage: 4, // How many items you want per page
      pathPrefix: `/${element}`, // Creates pages like `/blog`, `/blog/2`, etc
      component: path.resolve(`src/templates/${element}.js`), // Just like `createPage()`
      });
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
  categoriasgeo.forEach(element => {
    paginate(
      {
      createPage,
      items: postsgeo.data.allWpNew.nodes,
      itemsPerPage: 4, // How many items you want per page
      pathPrefix: `/${element}`, // Creates pages like `/blog`, `/blog/2`, etc
      component: path.resolve(`src/templates/ge/${element}.js`), // Just like `createPage()`
      });
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


