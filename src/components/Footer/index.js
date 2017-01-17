import React, { PropTypes } from "react"
import enhanceCollection from "phenomic/lib/enhance-collection"
import Link from "./Link"
import Svg from "react-svg-inline"
import OssSvg from "../icons/oss.svg"
// const git = <Svg className={ "material-icons" } svg={ OssSvg } cleanup />

import styles from "./index.css"

const Footer = (props, { router, metadata: { pkg }, collection }) => {
  return (
    <footer className={ styles.footer }>
      <nav className={ styles.quick }>
        <p>{ "Quick Navigation" }</p>
        <ul>
        {
          enhanceCollection(collection, {
            filter: { layout: "Section" },
            sort: "sort",
          }).map((page) => {
            console.log(page)
            const handleToggle = (event) => {
              event.preventDefault()
              router.push(page.__url)
            }
            return (
              <Link
                key={ page.title }
                href={ page.__url }
                onClick={ handleToggle }
              >
                { page.title }
              </Link>
            )
          })
        }
        </ul>
      </nav>
      <nav>
        <p>{ "Community" }</p>
        <ul>
          <Link
            className={ styles.link }
            href={ pkg.repository }
          >
            { "GitHub" }
          </Link>
          <Link
            className={ styles.link }
            href={ pkg.bugs.url }
          >
            { "Report a bug" }
          </Link>
        {
          enhanceCollection(collection, {
            sort: "sort",
          }).map((page) => {
            if (!page.community) return;
            const handleToggle = (event) => {
              event.preventDefault()
              router.push(page.__url)
            }
            return (
              <Link
                key={ page.title }
                className={ styles.link }
                href={ page.__url }
                onClick={ handleToggle }
              >
                { page.title }
              </Link>
            )
          })
        }
        </ul>
      </nav>
      <div className={ styles.oss }>
        <Svg svg={ OssSvg } cleanup />
      </div>
    </footer>
  )
}

// <a
//   href={ process.env.PHENOMIC_HOMEPAGE }
//   className={ styles.phenomicReference }
// >
//   { "Website generated with " }
//   <span className={ styles.phenomicReferenceName }>
//     {  `<${ process.env.PHENOMIC_NAME} />` }
//   </span>
// </a>
Footer.contextTypes = {
  metadata: PropTypes.object.isRequired,
  collection: PropTypes.array,
  router: PropTypes.object,
}

export default Footer
