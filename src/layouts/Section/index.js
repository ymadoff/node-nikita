import React, { PropTypes } from "react"
import enhanceCollection from "phenomic/lib/enhance-collection"
import styles from "./index.css"
import Link from "./Link"

import Page from "../Page"

const Section = (props, { router, collection }) => {
  const match = RegExp("^"+props.__url.replace("/", "\\/")+".*")
  const usages = enhanceCollection(collection, {
    filter: { layout: "Page", __url: match },
    sort: "sort",
  })
  return (
    <Page { ...props }>
      <nav>
        <ul>
        {
          usages.map((page) => {
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
                description={ page.description }
              >
                { page.title }
              </Link>
            )
          })
        }
        </ul>
      </nav>
    </Page>
  )
}

Section.propTypes = {
  __url: PropTypes.string,
}
Section.contextTypes = {
  collection: PropTypes.array.isRequired,
}

export default Section
