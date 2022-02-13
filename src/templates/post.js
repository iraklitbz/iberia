import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";

const Post = ({pageContext}) => {
    const {data} = pageContext;
    const [isPost, setIsPost] = useState(true);
    return ( 
        <MainLayout isPost={isPost}>
            <article>
                <div className="feature-v5 padding-bottom-lg">
                    <div className="feature-v5__content padding-top-xl bg-iberia bg-opacity-20% position-relative">
                        <div className="container max-width-adaptive-sm">
                            <div className="grid position-relative headline-box">
                                <div className="margin-bottom-md">
                                <h1 className="text-xxxl">{data.title}</h1>
                                </div>

                                {data.excerpt 
                                ? 
                                <div className="col-8@md margin-left-auto@md">
                                    <div className="text-component">
                                        <div dangerouslySetInnerHTML={{ __html: data.excerpt }} />
                                    </div>

                                </div>
                                : 
                                null
                                }
                        
                                
                            </div>
                        </div>
                        <figure className="scribble-bg " aria-hidden="true">
                            <svg className="scribble-bg__svg top-0 left-50% -translate-x-50% color-iberia opacity-10%" viewBox="0 0 1920 900">
                            <path d="M1368-15c-176.46,54.1-281.365,96.506-277,120.092,7.77,41.985,362,25.617,363,5,1.162-24.056-477.557-84.7-492-28-14.275,56.043,409.169,157.233,396,252-10.149,73.03-280.195,146.638-452,32-62.043-41.4-124.025-115.853-108-140,39.154-59,559.48,159.006,540,268-17.557,98.234-474.515,113.071-480,84-4.746-25.155,323.87-108.095,328-96,5.342,15.644-544.461,154.075-532,256,9.563,78.229,354.5,169,488,20,35.358-39.463,67.659-108.89,44-136-46.676-53.482-292.529,79.076-576,260" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5" strokeDasharray="5786"/>
                            </svg>
                        </figure>
                    </div>

                    <figure className="feature-v5__media container max-width-lg position-relative z-index-10">
                        {data.featuredImage 
                        ? 
                        <img className="block width-100% shadow-lg" src={data.featuredImage.node.sourceUrl} alt={data.title} />
                        : 
                            <div className="noImagen radius-md padding-y-xxxl">
                                <img width="245px" src="https://iberiainfo.me/wp-content/uploads/2022/02/logo_iberia_icon.svg" />
                            </div>
                        }
                       
                    </figure>
                </div>
    
                <div className="container max-width-adaptive-sm margin-bottom-xl js-sticky-sharebar-target">
                   
                    <div className="text-component line-height-lg text-space-y-md article-box" dangerouslySetInnerHTML={{ __html: data.content }} />
                    
                </div>
            </article>
      </MainLayout>
     );
}
 
export default Post;
