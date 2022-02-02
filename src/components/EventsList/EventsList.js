import React from "react";
import Pagination from "../Pagination/Pagination";
import { Link, useIntl } from "gatsby-plugin-intl";
import moment from "moment";
const EventsList = ({posts, pageContext}) => {
    const intl = useIntl();
    return ( 
        <div className="container max-width-adaptive-lg padding-y-xl">
            <div className="grid gap-sm">

                {posts.map((element, index) => (
                    <Link key={element.id} to={intl.locale === 'es' ? `/${element.slug}` :  `/geo/${element.slug}`} className={`card-v9 radius-md ${index === 0 || index === 3  ? 'col-8@md' : 'col-4@md'}`} style={{backgroundImage: `url("${element.featuredImage.node.sourceUrl}")`}}>
                        <div className="card-v9__content padding-md">
                        <div className="padding-bottom-xxxl max-width-xxs">
                            <p className="text-sm color-contrast-higher color-opacity-50% margin-bottom-xxs"><time>{moment(posts[0].date).subtract(10, 'days').calendar()}</time></p>
                            <h2 id="card-title-1" className="text-xl">{element.title}</h2>
                        </div>
                        {console.log(element.featuredImage)}

                        <div className="margin-top-auto">
                            <span className="card-v9__btn"><i>{intl.formatMessage({ id: "more" })}</i></span>
                        </div>
                        </div>
                    </Link>
                ))}    
           
            
                <Pagination posts={posts} pageContext={pageContext} />
            </div>
        </div>

     );
}
 
export default EventsList;