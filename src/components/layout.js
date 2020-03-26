import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import SOCIAL from "../constants/social";
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

const headerItems = [
  {
    text: 'Home',
    link: '/'
  },
  {
    text: 'Blog',
    link: '/posts'
  },
  {
    text: 'Projects',
    link: '/projects'
  }
];

const Layout = ({ location, title, children }) => {

  const data = useStaticQuery(graphql`
    query {
      avatar: file(absolutePath: { regex: "/smallant.png/" }) {
        childImageSharp {
          fixed(width: 26, height: 26) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  const { avatar } = data;

  // const rootPath = `${__PATH_PREFIX__}/`
  let header =
    <div className="layout-header">
      {
        headerItems.map(h => {
          return (
            <div className="header-item">
              <Link
                style={{
                  boxShadow: `none`,
                  textDecoration: `none`,
                  color: `inherit`,
                }}
                to={h.link}
              >
                {h.text}
              </Link>
            </div>
          )
        })
      }
    </div>;

  return (
    <div
      style={{
        position: 'relative',
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        height: '100%',
        padding: `${rhythm(3 / 4)}`,
      }}
    >
      <Image
        fixed={avatar.childImageSharp.fixed}
        alt='ant'
        style={{
          marginBottom: 0,
          minWidth: 26,
          minHeight: 26,
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          margin: 0,
          userSelect: 'none'
        }}
      />
      <header>{header}</header>
      <main>{children}</main>
      <footer className="layout-footer">
        © {new Date().getFullYear()} Julian David

        <div>
          {
            SOCIAL.map((s, index, array) => (
              <div style={{ display: "inline" }} key={s.kind}>
                <a className="u-no-box-shadow" href={s.url}>
                  {s.kind}
                </a>
                {(index + 1 < array.length) ? <span> / </span> : ''}
              </div>
            ))
          }
        </div>
      </footer>
    </div>
  )
}

export default Layout
