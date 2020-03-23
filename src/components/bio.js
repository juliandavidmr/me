/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import SOCIAL from '../constants/social';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rhythm } from "../utils/typography"

const Bio = ({ short = false }) => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 150, height: 150) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
        }
      }
    }
  `)

  const { author } = data.site.siteMetadata

  return (
    <div
      style={{
        marginBottom: rhythm(2.5),
      }}
    >
      <div className="hero-body">
        <div className="container">
          <div itemtype="http://schema.org/Person">
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author.name}
              style={{
                marginBottom: 0,
                minWidth: 120,
                minHeight: 120
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            <h1 className="title" itemprop="name">{author.name}</h1>
            <h2 className="subtitle" itemprop="description">{author.summary}</h2>
            <p>I make modules and apps. Mostly Typescript &amp; Node.js.</p>
          </div>
          <br />
          <p className="social-list">
            {SOCIAL.map((s) => (
              s.principal ?
                <div key={s.kind} className="social-item">
                  <FontAwesomeIcon
                    icon={s.icon}
                    color="var(--gray)"
                    title={`Link to my ${s.kind}`}
                  />
                  <a href={s.url}>
                    <span>{s.text}</span>
                  </a>
                </div>
                : ''
            ))}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Bio
