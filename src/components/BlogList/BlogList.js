import React from "react";
import Pagination from "../Pagination/Pagination";
import moment from "moment";
import { useIntl, Link } from "gatsby-plugin-intl";
const BlogList = ({posts, pageContext}) => {
    const intl = useIntl();
    return ( 
        <div className="position-relative z-index-1 padding-y-xl">
            <div className="container max-width-adaptive-lg">
                <div className="grid gap-lg">
                    {posts.length > 0 
                    ? 
                    <article className="story story--featured">
                        <Link className="story__img radius-md"  to={intl.locale === 'es' ? `/${posts[0].slug}` :  `/geo/${posts[0].slug}`}>
                       
                        <figure className="aspect-ratio-4:3">
                            {posts[0].featuredImage
                            ? 
                                <img src={posts[0].featuredImage.node.sourceUrl} alt={posts[0].title} />
                            : 
                                <div className="noImagen radius-md">
                                    <img width="245px" src="https://iberiainfo.me/wp-content/uploads/2022/02/logo_iberia_i.svg" />
                                </div>
                            }
                           
                        </figure>
                        </Link>

                        <div className="story__content">
                        <div className="margin-bottom-xs">
                            <span className="story__category">
                            <i><time>{moment(posts[0].date).subtract(10, 'days').calendar()}</time></i>
                            </span>
                        </div>
                
                        <div className="text-component">
                            <h2 className="story__title"><Link to={intl.locale === 'es' ? `/${posts[0].slug}` :  `/geo/${posts[0].slug}`}>{posts[0].title}</Link></h2>
                            <div dangerouslySetInnerHTML={{__html: posts[0].excerpt.substring(0,130) + " ..." }}></div>
                            
                        </div>
                
                     
                        </div>
                    </article>
                    : 
                    <h3>No hay más</h3>
                    }
               
                {posts.slice(1).map((element) => (
                    <article key={element.id} className="story col-4@md">
                        <Link className="story__img radius-md" to={intl.locale === 'es' ? `/${element.slug}` :  `/geo/${element.slug}`}>
                        <figure className="aspect-ratio-4:3">
                            {   element.featuredImage 
                            ? 
                                <img src={element.featuredImage.node.sourceUrl} alt={element.title} />
                            : 
                                <div className="noImagen radius-md">
                                    <img width="245px" src="https://iberiainfo.me/wp-content/uploads/2022/02/logo_iberia_i.svg" />
                                </div>
                            }
                           
                        </figure>
                        </Link>

                        <div className="story__content">
                        <div className="margin-bottom-xs">
                            <Link className="story__category" to={intl.locale === 'es' ? `/${element.slug}` :  `/geo/${element.slug}`}>
                            <i><time>{moment(posts[0].date).subtract(10, 'days').calendar()}</time></i>
                            </Link>
                        </div>
                
                        <div className="text-component">
                            <h2 className="story__title"><Link to={intl.locale === 'es' ? `/${element.slug}` :  `/geo/${element.slug}`}>{element.title}</Link></h2>
                            
                        </div>
                
                      
                        </div>
                    </article>
                 ))}

               

               
                </div>

                <Pagination posts={posts} pageContext={pageContext} />
            </div>
            </div>

        
               
           
     );
}
 
export default BlogList;