import React, { PropTypes } from "react"
import enhanceCollection from "phenomic/lib/enhance-collection"
import Link from "./Link"
import Svg from "react-svg-inline"
import OssSvg from "../icons/oss.svg"
// const git = <Svg className={ "material-icons" } svg={ OssSvg } cleanup />

import styles from "./index.css"

const Footer = (props, { router, metadata: { pkg }, collection }) => {
  // const { router, metadata: { pkg }, collection } = this.context;
  const quick = enhanceCollection(collection, {
    // filter: { quick: true },
    filter: { layout: "Section" },
    sort: "sort",
  })
  const contribute = enhanceCollection(collection, {
    filter: { contribute: true },
    sort: "sort",
  })
  return (
    <footer className={ styles.footer }>
      <nav className={ styles.quick }>
        <p>{ "Quick Navigation" }</p>
        <ul>
        {
          quick.map((page) => {
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
        <p>{ "Contribute" }</p>
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
          contribute.map((page) => {
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
