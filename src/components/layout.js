import React from "react"
import { Link } from "gatsby"
import SOCIAL from "../constants/social";

import { rhythm } from "../utils/typography"

const headerItems = [
  {
    text: 'Home',
    link: '/'
  },
  {
    text: 'Projects',
    link: '/projects'
  }
];

const Layout = ({ location, title, children }) => {
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
