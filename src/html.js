import React from "react"
import PropTypes from "prop-types";

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet' />
        <link rel="apple-touch-icon" sizes="57x57" href="https://iberiainfo.me/wp-content/uploads/favicon/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="https://iberiainfo.me/wp-content/uploads/favicon/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="https://iberiainfo.me/wp-content/uploads/favicon/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="https://iberiainfo.me/wp-content/uploads/favicon/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="https://iberiainfo.me/wp-content/uploads/favicon/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="https://iberiainfo.me/wp-content/uploads/favicon/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="https://iberiainfo.me/wp-content/uploads/favicon/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="https://iberiainfo.me/wp-content/uploads/favicon/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://iberiainfo.me/wp-content/uploads/favicon/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192"  href="https://iberiainfo.me/wp-content/uploads/favicon/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://iberiainfo.me/wp-content/uploads/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="https://iberiainfo.me/wp-content/uploads/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://iberiainfo.me/wp-content/uploads/favicon/favicon-16x16.png" />
        <link rel="manifest" href="https://iberiainfo.me/wp-content/uploads/favicon/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="https://iberiainfo.me/wp-content/uploads/favicon/ms-icon-144x144.png" />
      
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
      
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
