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
          fixed(width: 50, height: 50) {
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
          social {
            twitter
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata

  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
      className="main-bio-container"
    >
      <div className="main-bio">
        <h1 className="heroine" style={{ marginBottom: rhythm(1 / 5), fontSize: short ? '1rem' : undefined }}>
          <Image
            fixed={data.avatar.childImageSharp.fixed}
            alt={author.name}
            style={{
              marginRight: rhythm(1 / 2),
              marginBottom: 0,
              minWidth: 50,
              borderRadius: `100%`,
            }}
            imgStyle={{
              borderRadius: `50%`,
            }}
          />
          Hello! Julian is a software engineer {' '}
          <span role="img" aria-label="sparkles">
            ✨
          </span>
        </h1>
        {short ? '' :
          <div>
            <ul
              className="horizontal-links"
              style={{ marginBottom: rhythm(1) }}
            >
              {SOCIAL.map(s => (
                <li key={s.kind}>
                  <a className="u-no-box-shadow" href={s.url}>
                    <FontAwesomeIcon
                      icon={s.icon}
                      color="var(--gray)"
                      title={`Link to my ${s.kind}`}
                    />
                  </a>
                </li>
              ))}
            </ul>
            <p>
              Hi there! I&apos;m a polyglot System Engineer. I work at Bizagi Latam.
              <span role="img" aria-label="woman surfing">
                🏄🏻‍♀️
              </span>{' '}
              I&apos;m started my career in technology as a Full Stack developer
              and now work as a Front End Software Engineer developer.
              I write about JavaScript, TypeScript, Web Assembly and more. Welcome!
            </p>
          </div>
        }
      </div>
    </div>
  )
}

export default Bio
