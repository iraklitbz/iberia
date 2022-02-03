import React from "react";
import { useIntl, Link } from "gatsby-plugin-intl";
const Bradcrumbs = ({pageCotext}) => {
    const intl = useIntl();
    return ( 
        <nav className="breadcrumbs text-sm" aria-label="Breadcrumbs">
            <ol className="flex flex-wrap gap-xxs">
                <li className="breadcrumbs__item">
                <Link to="/" className="color-inherit">{intl.formatMessage({ id: "home" })}</Link>
                    <svg className="icon margin-left-xxxs color-contrast-low" aria-hidden="true" viewBox="0 0 16 16"><polyline fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="6.5,3.5 11,8 6.5,12.5 "></polyline></svg>
                </li>

                <li className="breadcrumbs__item">
                    <Link to="/about" className="color-inherit">{intl.formatMessage({ id: `aboutus` })}</Link>
                    <svg className="icon margin-left-xxxs color-contrast-low" aria-hidden="true" viewBox="0 0 16 16"><polyline fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="6.5,3.5 11,8 6.5,12.5 "></polyline></svg>
                </li>

                <li className="breadcrumbs__item" aria-current="page">Project</li>
            </ol>
        </nav>
     );
}
 
export default Bradcrumbs;