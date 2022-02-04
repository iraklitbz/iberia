import React, { useState } from "react";
import { useIntl, Link } from "gatsby-plugin-intl";
import MainLayout from "../layouts/MainLayout";
import Bradcrumbs from "../components/Breadcrumbs/Breadcrumbs";
const Ourteam = ({pageContext}) => {
    const intl = useIntl();
    const [ourTeamArray, setOurTeamArray] = useState([
        {
            id: '1',
            name: intl.formatMessage({ id: "ourteam_team1_1" }),
            profileUrl: 'https://cms.iberiainfo.org/wp-content/uploads/2022/02/Captura-de-pantalla-2017-02-25-a-las-1.12.27.png',
            cargo: intl.formatMessage({ id: "ourteam_team1_2" }),
            hasContact: true,
            contact: 'facebook',
            contactUrl: 'loram'
        },
        {
            id: '2',
            name: intl.formatMessage({ id: "ourteam_team2_1" }),
            profileUrl: 'https://cms.iberiainfo.org/wp-content/uploads/2022/02/Captura-de-pantalla-2017-02-25-a-las-1.12.27.png',
            cargo: intl.formatMessage({ id: "ourteam_team2_2" }),
            hasContact: false,
        },
       {
            id: '3',
            name: intl.formatMessage({ id: "ourteam_team3_1" }),
            profileUrl: 'https://cms.iberiainfo.org/wp-content/uploads/2022/02/Captura-de-pantalla-2017-02-25-a-las-1.12.27.png',
            cargo: intl.formatMessage({ id: "ourteam_team3_2" }),
            hasContact: true,
            contact: 'twitter',
            contactUrl: 'loram'
        }
    ])
    return ( 
        <MainLayout>
            
             <section className="position-relative z-index-1 bg-iberia  padding-y-lg">
                    <div className="container max-width-adaptive-lg margin-bottom-lg">
                        <Bradcrumbs />
                    </div>
            
                    <div className="container max-width-adaptive-lg">
                        
                    <div className="margin-bottom-xl">
                        <h2 className="text-center">{intl.formatMessage({ id: "ourteam" })}</h2>
                    </div>
                    <div className="grid gap-xl">
                   {ourTeamArray.map(element => (
                        <div key={element.id} className="card-v13 col-4@md">
                            <div className="card-v13__figure-wrapper">
                                <figure className="card-v13__figure">
                                    <img src={element.profileUrl} alt="Image description" loading="lazy" />
                                </figure>
                            </div>

                            <div className="text-center margin-top-sm">
                                <h3 className="text-md">
                                <span className="color-contrast-higher">{element.name}</span>
                                </h3>

                                <div className="card-v13__separator margin-x-auto margin-y-sm" role="presentation"></div>

                                <p className="color-contrast-medium text-sm line-height-lg">{element.cargo}</p>

                                <div className="margin-top-sm">
                                {element.hasContact 
                                ? 
                                <Link to={element.contactUrl} className="reset btn-fx-3 radius-md text-sm">
                                    <div className="btn-fx-3__inner padding-y-xs padding-x-md">
                                    <span>{intl.formatMessage({ id: "contactus" })}</span>
                                    
                                    <figure className="btn-fx-3__icon-wrapper" aria-hidden="true">
                                        <i className={`bx bxl-${element.contact} bx-sm`}></i>
                                    </figure>
                                    </div>
                                </Link>
                                : 
                                null
                                }   
                                
                                </div>
                            </div>
                        </div>
                   ))}
                   
                        
                       
                    </div>
                    </div>
                </section>
        </MainLayout>
     );
}
 
export default Ourteam;