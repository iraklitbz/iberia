import React from "react";
import MainLayout from "../layouts/MainLayout";

const Post = ({pageContext}) => {
    return ( 
        <MainLayout>
            <article className="padding-y-lg">
            <header className="container max-width-xs margin-bottom-lg">
                <div className="text-component text-center line-height-lg text-space-y-md margin-bottom-md">
                <h1>{pageContext.title}</h1> 
                <p className="color-contrast-medium text-md">sfewf</p>
                </div>
    
                <div className="flex justify-center">
                <div className="author author--meta">
                    <a href="#0" className="author__img-wrapper">
                 
                    </a>
    
                    <div className="author__content text-component text-space-y-xxs">
                    <h4 className="text-base"><a href="#0" rel="author">Olivia Gribben</a></h4>
                    <p className="text-sm color-contrast-medium"><time>May 15</time> &mdash; 5 min read</p>
                    </div>
                </div>
                </div>
            </header>
    
            <figure className="container max-width-lg margin-bottom-lg">
                
            </figure>
    
            <div className="container max-width-adaptive-sm">
                <div className="text-component line-height-lg text-space-y-md">
             
                </div>
            </div>
            </article>
      </MainLayout>
     );
}
 
export default Post;