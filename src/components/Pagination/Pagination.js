import React from "react";
import PropType from 'prop-types';
import { useIntl, Link } from "gatsby-plugin-intl";
const Pagination = ({ pageContext}) => {
  console.log('holaaaa', pageContext.intl.originalPath)
  const intl = useIntl();
  const { previousPagePath,nextPagePath, numberOfPages } = pageContext;
  let arrPagination = Array.apply(null, {length: numberOfPages +1}).map(Number.call, Number);
  return ( 
  <>
      {numberOfPages <= 1 ? null : 
        <nav className="pagination margin-top-xl" aria-label="Pagination">
        <ol className="pagination__list flex flex-wrap gap-xxxs justify-center">
          <li>
          
            <Link to={previousPagePath} className={`pagination__item ${!previousPagePath ? "pagination__item--disabled" : ""}`} aria-label="Go to previous page">
              <svg className="icon icon--xs margin-right-xxxs flip-x" viewBox="0 0 16 16"><polyline points="6 2 12 8 6 14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              <span>{intl.formatMessage({ id: "prev" })}</span>
            </Link>
          
            
          </li>

          {
          arrPagination.slice(1).map((element, index) => (
              <li key={index} className="display@sm">
                <Link to={index === 0 ? `${pageContext.intl.originalPath}` : `${pageContext.intl.originalPath}/${index + 1}`} className="pagination__item" activeClassName="active" aria-label="Go to page 20">{element}</Link>
            </li>
          ))
        }
            
            
        

          <li>
          
              <Link to={nextPagePath} className={`pagination__item ${!nextPagePath ? "pagination__item--disabled" : ""}`} aria-label="Go to next page">
                <span>{intl.formatMessage({ id: "next" })}</span>
                <svg className="icon icon--xs margin-left-xxxs" viewBox="0 0 16 16"><polyline points="6 2 12 8 6 14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              </Link> 
              
          </li>
        </ol>
      </nav>
      }
        
      </>
   );
}

Pagination.protoType = {
  pageContext: PropType.object.isRequired
}
 
export default Pagination;