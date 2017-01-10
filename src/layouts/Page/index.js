import React, { PropTypes } from "react"
import Helmet from "react-helmet"
import invariant from "invariant"
import { BodyContainer, joinUri } from "phenomic"

import styles from "./index.scss"
import {} from "material-icons/src/stylus/material-icons.styl"
import {} from "../theme.scss"

class Page extends React.Component {
  state = {
    drawerActive: false,
    drawerPinned: false,
    sidebarPinned: false,
  };
  render() {
    const { __filename, head, body, header, footer, children } = this.props
    const { metadata: { pkg } } = this.context
    invariant (
      typeof head.title === "string",
      `Your page '${ __filename }' needs a title`
    )
    const metaTitle = head.metaTitle ? head.metaTitle : head.title
    const meta = [
      { property: "og:type", content: "article" },
      { property: "og:title", content: metaTitle },
      {
        property: "og:url",
        content: joinUri(process.env.PHENOMIC_USER_URL, "/"),
      },
      { property: "og:description", content: head.description },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: metaTitle },
      { name: "twitter:creator", content: `@${ pkg.twitter }` },
      { name: "twitter:description", content: head.description },
      { name: "description", content: head.description },
      { name: "viewport", content:
          "width=device-width; height=device-height; initial-scale=1.0; "+
          "minimum-scale=1.0; maximum-scale=1.0; user-scalable=no",
      },
    ]
    const link = [
      "https://fonts.googleapis.com/icon?family=Material+Icons",
      "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700",
    ].map(font => ({ rel: "stylesheet", href: font }))
    return (
      <div className={ styles.page }>
        <Helmet
          title={ metaTitle }
          meta={ meta }
          link={ link }
        />
        <div style={ styles.layout }>
          {
            head.title &&
            <h1 className={ styles.heading }>{ head.title }</h1>
          }
          { header }
          <BodyContainer>{ body }</BodyContainer>
          { children }
          { footer }
        </div>
      </div>
    )
  }
}

// const Page = (
//   {
//     __filename,
//     __url,
//     head,
//     body,
//     header,
//     footer,
//     children,
//   },
//   {
//     metadata: { pkg },
//   }
// ) => {
//   invariant(
//     typeof head.title === "string",
//     `Your page '${ __filename }' needs a title`
//   )
//
//   const metaTitle = head.metaTitle ? head.metaTitle : head.title
//
//   const meta = [
//     { property: "og:type", content: "article" },
//     { property: "og:title", content: metaTitle },
//     {
//       property: "og:url",
//       content: joinUri(process.env.PHENOMIC_USER_URL, __url),
//     },
//     { property: "og:description", content: head.description },
//     { name: "twitter:card", content: "summary" },
//     { name: "twitter:title", content: metaTitle },
//     { name: "twitter:creator", content: `@${ pkg.twitter }` },
//     { name: "twitter:description", content: head.description },
//     { name: "description", content: head.description },
//   ]
//
//   const metaLink = [
//     "https://fonts.googleapis.com/icon?family=Material+Icons",
//     "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700",
//   ]
//   return (
//     <div className={ styles.page }>
//       <Helmet
//         title={ metaTitle }
//         meta={ meta }
//         link={ metaLink.map(font => ({ rel: "stylesheet", href: font })) }
//       />
//       {
//         head.title &&
//         <h1 className={ styles.heading }>{ head.title }</h1>
//       }
//       { header }
//       <BodyContainer>{ body }</BodyContainer>
//       { children }
//       { footer }
//     </div>
//   )
// }

Page.propTypes = {
  children: PropTypes.node,
  __filename: PropTypes.string.isRequired,
  __url: PropTypes.string.isRequired,
  head: PropTypes.object.isRequired,
  body: PropTypes.string.isRequired,
  header: PropTypes.element,
  footer: PropTypes.element,
}

Page.contextTypes = {
  metadata: PropTypes.object.isRequired,
}

export default Page
