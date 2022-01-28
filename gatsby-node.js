const path = require(`path`)
const { paginate } = require('gatsby-awesome-pagination');

// pages locale
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  deletePage(page)
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
  const categorias = ['events','news','programs','tours','activities' ]

  categorias.forEach(element => {
      createRedirect({
        fromPath: `/ge/${element}`,
        exactPath: true,
        isPermanent: false,
        redirectInBrowser: true,
        toPath: `/ge/${element}-ge`
      });
      createRedirect({
        fromPath: `/es/${element}-ge`,
        exactPath: true,
        isPermanent: false,
        redirectInBrowser: true,
        toPath: `/es/${element}`
    });
  })

     
 
/*es*/ 
const activities = await graphql(`
      query getPost {
        allWpPost(
          filter: {categories: {nodes: {elemMatch: {name: {eq: "activities"}}}}}
          ) {
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

const events = await graphql(`
    query getPost {
      allWpPost(
        filter: {categories: {nodes: {elemMatch: {name: {eq: "events"}}}}}
        ) {
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

const news = await graphql(`
  query getPost {
    allWpPost(
      filter: {categories: {nodes: {elemMatch: {name: {eq: "news"}}}}}
      ) {
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
const programs = await graphql(`
  query getPost {
    allWpPost(
      filter: {categories: {nodes: {elemMatch: {name: {eq: "programs"}}}}}
      ) {
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
const tours = await graphql(`
  query getPost {
    allWpPost(
      filter: {categories: {nodes: {elemMatch: {name: {eq: "tours"}}}}}
      ) {
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
const post = await graphql(`
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

/*ge*/ 
const activitiesgeo = await graphql(`
    query getPost {
      allWpNew(
        filter: {geocategories: {nodes: {elemMatch: {name: {eq: "activities"}}}}}
        ) {
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
const eventsgeo = await graphql(`
    query getPost {
      allWpNew(
        filter: {geocategories: {nodes: {elemMatch: {name: {eq: "events"}}}}}
        ) {
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
const newsgeo = await graphql(`
    query getPost {
      allWpNew(
        filter: {geocategories: {nodes: {elemMatch: {name: {eq: "news"}}}}}
        ) {
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
const programsgeo = await graphql(`
    query getPost {
      allWpNew(
        filter: {geocategories: {nodes: {elemMatch: {name: {eq: "programs"}}}}}
        ) {
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
const toursgeo = await graphql(`
    query getPost {
      allWpNew(
        filter: {geocategories: {nodes: {elemMatch: {name: {eq: "tours"}}}}}
        ) {
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
const postgeo = await graphql(`
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
  

  
/*ES*/

paginate({
    createPage,
    items: activities.data.allWpPost.nodes,
    itemsPerPage: 4, // How many items you want per page
    pathPrefix: `/activities`, // Creates pages like `/blog`, `/blog/2`, etc
    component: path.resolve(`src/templates/activities.js`), // Just like `createPage()`
});
paginate({
  createPage,
  items: events.data.allWpPost.nodes,
  itemsPerPage: 4, // How many items you want per page
  pathPrefix: `/events`, // Creates pages like `/blog`, `/blog/2`, etc
  component: path.resolve(`src/templates/events.js`), // Just like `createPage()`
});
paginate({
  createPage,
  items: news.data.allWpPost.nodes,
  itemsPerPage: 4, // How many items you want per page
  pathPrefix: `/news`, // Creates pages like `/blog`, `/blog/2`, etc
  component: path.resolve(`src/templates/news.js`), // Just like `createPage()`
});
paginate({
  createPage,
  items: programs.data.allWpPost.nodes,
  itemsPerPage: 4, // How many items you want per page
  pathPrefix: `/programs`, // Creates pages like `/blog`, `/blog/2`, etc
  component: path.resolve(`src/templates/programs.js`), // Just like `createPage()`
});
paginate({
  createPage,
  items: tours.data.allWpPost.nodes,
  itemsPerPage: 4, // How many items you want per page
  pathPrefix: `/tours`, // Creates pages like `/blog`, `/blog/2`, etc
  component: path.resolve(`src/templates/tours.js`), // Just like `createPage()`
});

post.data.allWpPost.nodes.forEach(element => {
  createPage({
  path: `/${element.slug}`,
  component: path.resolve(`src/templates/post.js`),
  context: {
  data: element
  }
  })
});

paginate({
  createPage,
  items: activitiesgeo.data.allWpNew.nodes,
  itemsPerPage: 4, // How many items you want per page
  pathPrefix: `/activities-ge`, // Creates pages like `/blog`, `/blog/2`, etc
  component: path.resolve(`src/templates/ge/activities.js`), // Just like `createPage()`
});
paginate({
  createPage,
  items: eventsgeo.data.allWpNew.nodes,
  itemsPerPage: 4, // How many items you want per page
  pathPrefix: `/events-ge`, // Creates pages like `/blog`, `/blog/2`, etc
  component: path.resolve(`src/templates/ge/events.js`), // Just like `createPage()`
});
paginate({
  createPage,
  items: newsgeo.data.allWpNew.nodes,
  itemsPerPage: 4, // How many items you want per page
  pathPrefix: `/news-ge`, // Creates pages like `/blog`, `/blog/2`, etc
  component: path.resolve(`src/templates/ge/news.js`), // Just like `createPage()`
});
paginate({
  createPage,
  items: programsgeo.data.allWpNew.nodes,
  itemsPerPage: 4, // How many items you want per page
  pathPrefix: `/programs-ge`, // Creates pages like `/blog`, `/blog/2`, etc
  component: path.resolve(`src/templates/ge/programs.js`), // Just like `createPage()`
});
paginate({
  createPage,
  items: toursgeo.data.allWpNew.nodes,
  itemsPerPage: 4, // How many items you want per page
  pathPrefix: `/tours-ge`, // Creates pages like `/blog`, `/blog/2`, etc
  component: path.resolve(`src/templates/ge/tours.js`), // Just like `createPage()`
});

  postgeo.data.allWpNew.nodes.forEach(element => {
    createPage({
    path: `/${element.slug}`,
    component: path.resolve(`src/templates/post.js`),
    context: {
    data: element
    }
    })
  });
}


