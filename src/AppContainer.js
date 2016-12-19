import React, { PropTypes } from "react"

import "./index.global.css"
import "./highlight.global.css"
import styles from "./AppContainer.css"

import Container from "./components/Container"
import Nav from "./components/Nav"
import DefaultHeadMeta from "./components/DefaultHeadMeta"
import Header from "./components/Header"
import Content from "./components/Content"
import Footer from "./components/Footer"

class AppContainer extends React.Component {
  onLeftIconClick = (e) => {
    console.log('ok');
  }
  render() {
    const { children } = this.props
    return (
      <div>
      <Container className={ styles.container }>
        <DefaultHeadMeta />
        <Nav />
        <Header onLeftIconClick={ this.onLeftIconClick }/>
        <Content>
          { children }
        </Content>
        <Footer />
      </Container>
      </div>
    )
  }
}

AppContainer.propTypes = {
  children: PropTypes.node,
}

export default AppContainer
