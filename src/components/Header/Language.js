import React from "react"
import { IntlContextConsumer, changeLocale } from "gatsby-plugin-intl"

const languageName = {
  es: "es",
  ge: "ქა",
}

const Language = () => {
  return (
    <ul className="f-header__list lang-list">
      <IntlContextConsumer>
        {({ languages, language: currentLocale }) =>
          languages.map(language => (
            <a
              className="f-header__link"
              key={language}
              onClick={() => changeLocale(language)}
              style={{
                color: currentLocale === language ? 'var(--color-primary)' : 'var(--color-contrast-high)'
              }}
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