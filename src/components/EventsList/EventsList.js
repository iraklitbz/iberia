import React from "react";
import Pagination from "../Pagination/Pagination";
import { Link } from "gatsby-plugin-intl";
const EventsList = ({posts, pageContext}) => {
   
    return ( 
        <section className="feature-v8 padding-bottom-xxl">
            <div className="feature-v8__main-content bg-contrast-lower bg-opacity-50% padding-top-xxl">
                <div className="container max-width-adaptive-lg">
                <div className="grid gap-md justify-between@md">
                    <div className="col-6@md">
                    <div className="text-component">
                        <h1>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</h1>
                    </div>
                    </div>

                    <div className="col-5@md">
                    <div className="text-component">
                        <p className="color-contrast-medium">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus asperiores laudantium at sunt voluptatibus a distinctio adipisci dicta, explicabo quidem.</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            <div className="container max-width-adaptive-lg">
                <ul className="feature-v8__sub-content grid gap-lg">
                {posts.map((element) => (
                    <li key={element.id} className="col-4@md">
                        <Link to={`/${element.slug}`} className="block margin-bottom-sm">
                        <figure className="td-card js-td-card">
                            {/* <img className="block width-100% shadow-md radius-lg" src={element.thumb.localFile.publicURL} /> */}
                
                        </figure>

                        <footer className="padding-sm">
                            <p className="text-sm color-contrast-medium margin-bottom-sm">Label</p>
                            <div className="text-component">
                            <h4 className="story-v2__headline"><span className="card-v8__title">{element.title}</span></h4>
                            </div>
                        </footer>
                        </Link>
                     </li>
                    ))}
                </ul>
                <Pagination pageContext={pageContext} />
            </div>
            </section>
     );
}
 
export default EventsList;