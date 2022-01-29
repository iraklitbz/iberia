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
                            <a className="story__category" href="#0">
                            <svg className="icon margin-right-xxxs" aria-hidden="true" viewBox="0 0 16 16"><g strokeWidth='1' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round'><circle cx='8' cy='7' r='1.5'></circle><path d='M12.121,14.263a7.5,7.5,0,1,0-8.242,0'></path><path d='M12.377,11.32a5.5,5.5,0,1,0-8.754,0'></path><path d='M6.605,10.5H9.4a1,1,0,0,1,1,1.1L10,15.5H6l-.39-3.9A1,1,0,0,1,6.605,10.5Z'></path></g></svg>
                            <i>Noticias</i>
                            </a>
                        </div>
                
                        <div className="text-component">
                            <h2 className="story__title"><a href="#0">{posts[0].title}</a></h2>
                            <div dangerouslySetInnerHTML={{__html: posts[0].excerpt.substring(0,130) + " ..." }}></div>
                            
                        </div>
                
                        <p className="story__meta"><time>{moment(posts[0].date).subtract(10, 'days').calendar()}</time></p>
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
                            <svg className="icon margin-right-xxxs" aria-hidden="true" viewBox="0 0 16 16"><g strokeWidth='1' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round'><rect x='0.5' y='1.5' width='15' height='13' rx='1' ry='1'></rect><polygon points='5.5 4.5 11 8 5.5 11.5 5.5 4.5'></polygon></g></svg>
                            <i>Noticias</i>
                            </a>
                        </div>
                
                        <div className="text-component">
                            <h2 className="story__title"><a href="#0">{element.title}</a></h2>
                            
                        </div>
                
                        <p className="story__meta margin-top-xs"><time>{moment(element.date).subtract(10, 'days').calendar()}</time></p>
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