import React from "react";
import PropType from 'prop-types';
import { useIntl, Link } from "gatsby-plugin-intl";
const Team = () => {
    const intl = useIntl();
    return ( 
        <section className="position-relative z-index-1 padding-y-lg">
            <div className="container max-width-adaptive-lg">
                <div className="grid gap-md items-center">
                <div className="col-6@md">
                    <div className="text-component">
                        <h1>{intl.formatMessage({ id: "aboutus4" })}</h1>
                        <p>{intl.formatMessage({ id: "aboutus5" })}</p>
                        </div>

                    <div className="margin-top-sm">
                    <div className="flex flex-wrap gap-sm items-center">
                        <Link to="/our-team" className="btn btn--primary">{intl.formatMessage({ id: "aboutus6" })}</Link>

                    </div>
                    </div>
                </div>

                <div className="col-6@md">

                    <div className="diamond-grid ">
                    <div className="diamond-grid__inner">

                        <div className="diamond-grid__item bg-contrast-lower shadow-md">
                        <img className="diamond-grid__img" src="../../../app/assets/img/diamond-grid-img-1.jpg" alt="Image description" />
                        </div>

                        <div className="diamond-grid__item bg-contrast-lower shadow-md">
                        <img className="diamond-grid__img" src="../../../app/assets/img/diamond-grid-img-2.jpg" alt="Image description" />
                        </div>

                        <div className="diamond-grid__item bg-contrast-lower shadow-md">
                        <img className="diamond-grid__img" src="../../../app/assets/img/diamond-grid-img-3.jpg" alt="Image description" />
                        </div>

                        <div className="diamond-grid__item bg-contrast-lower shadow-md">
                        <img className="diamond-grid__img" src="../../../app/assets/img/diamond-grid-img-4.jpg" alt="Image description" />
                        </div>

                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>
     );
}
 
export default Team;