import React from "react";
import Pagination from "../Pagination/Pagination";
import moment from "moment";
const BlogList = ({posts, pageContext}) => {
   
    return ( 
        <div className="position-relative z-index-1 padding-y-xl">
            <div className="container max-width-adaptive-lg">
                <div className="grid gap-lg">
                    {posts.length > 0 
                    ? 
                    <article className="story story--featured">
                        <a className="story__img radius-md" href="#0">
                        <figure className="aspect-ratio-4:3">
                            <img src={posts[0].featuredImage.node.sourceUrl} alt="Image description" />
                        </figure>
                        </a>

                        <div className="story__content">
                        <div className="margin-bottom-xs">
                            <span className="story__category">
                            <i><time>{moment(posts[0].date).subtract(10, 'days').calendar()}</time></i>
                            </span>
                        </div>
                
                        <div className="text-component">
                            <h2 className="story__title"><a href="#0">{posts[0].title}</a></h2>
                            <div dangerouslySetInnerHTML={{__html: posts[0].excerpt.substring(0,130) + " ..." }}></div>
                            
                        </div>
                
                     
                        </div>
                    </article>
                    : 
                    <h3>No hay más</h3>
                    }
               
                {posts.slice(1).map((element) => (
                    <article key={element.id} className="story col-4@md">
                        <a className="story__img radius-md" href="#0">
                        <figure className="aspect-ratio-4:3">
                            <img src={element.featuredImage.node.sourceUrl} alt={element.title} />
                        </figure>
                        </a>

                        <div className="story__content">
                        <div className="margin-bottom-xs">
                            <a className="story__category" href="#0">
                            <i><time>{moment(posts[0].date).subtract(10, 'days').calendar()}</time></i>
                            </a>
                        </div>
                
                        <div className="text-component">
                            <h2 className="story__title"><a href="#0">{element.title}</a></h2>
                            
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