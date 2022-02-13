import React from "react";
import { useIntl, Link } from "gatsby-plugin-intl";
const HomeList = ({posts}) => {
    const intl = useIntl();
    return ( 
        <section className="position-relative z-index-1 padding-y-xl bg-cover bg-center">
                <div className="container max-width-adaptive-lg">
                    <div className="margin-bottom-lg">
                    <h1 className="text-center">{intl.formatMessage({ id: "home4" })}</h1>
                    </div>

                    <div className="grid gap-sm">
                   {posts.map((element => (
                        <Link key={element.id} className="card-v12 padding-top-sm radius-lg shadow-sm col-6@sm col-3@md" to={intl.locale === 'es' ? `/${element.slug}` :  `/geo/${element.slug}`} aria-label="Link description">
                            <div className="position-relative">
                            <figure className="card-v12__figure radius-sm">
                            {   element.featuredImage 
                            ? 
                                 <img src={element.featuredImage.node.sourceUrl} alt={element.title} />
                            : 
                                <div className="noImagen radius-md">
                                    <img width="245px" src="https://iberiainfo.me/wp-content/uploads/2022/02/logo_iberia_icon.svg" />
                                </div>
                            }
                                 
                            </figure>

                            <svg className="icon card-v12__icon" viewBox="0 0 60 60">
                                <g className="icon-group" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="30" x2="57" y2="30" />
                                <line x1="57" y1="30" x2="43" y2="44" />
                                <line x1="43" y1="16" x2="57" y2="30" />
                                </g>
                            </svg>
                            </div>

                            <div className="text-center padding-sm">
                            <h3 className="text-base">{element.title}</h3>

                            <div className="card-v12__separator border-top border-contrast-higher border-opacity-10% margin-x-auto margin-y-xs" role="presentation"></div>

                            <p className="text-xs color-contrast-higher color-opacity-50% text-uppercase letter-spacing-lg">
                               {intl.locale === 'es' 
                                    ? element.categories.nodes.slice(1).filter(el => el.name !== 'home').map(item => (item.name))
                                    :  element.geocategories.nodes.slice(1).filter(el => el.name !== 'home').map(item => (item.name))
                               }
                            </p>
                        </div>
                        </Link>

                    )))}
                   

                   
                    </div>
                </div>
        </section>
     );
}
 
export default HomeList;