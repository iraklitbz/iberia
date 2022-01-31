import React from "react"
import { IntlContextConsumer, changeLocale } from "gatsby-plugin-intl"

const languageName = {
  es: "es",
  ge: "ქა",
}

const Language = () => {
  return (
    <ul className="f-header__list lang-list margin-left-sm@md">
      <IntlContextConsumer>
        {({ languages, language: currentLocale }) =>
          languages.map(language => (
            <a
              key={language}
              onClick={() => changeLocale(language)}
              className={
               currentLocale === language ? 'f-header__link active' : 'f-header__link'
              }
            >
              {languageName[language]}
            </a>
          ))
        }
      </IntlContextConsumer>
    </ul>
  )
}

export default Language;