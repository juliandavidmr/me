module.exports = {
  pathPrefix: "/me",
  siteMetadata: {
    title: `My Personal Blog`,
    author: {
      name: `Julian David`,
      summary: `Hi there! I'm a polyglot Web Developer.`,
    },
    description: `My personal blog built with Gatsby.`,
    siteUrl: `https://juliandavidmr.github.io/`,
    social: {
      twitter: `anlijudavid`,
    },
    projects: [
      {
        title: 'COVID-19 Coronavirus Statistics',
        link: '/coronavirus'
      },
      {
        title: 'awesome-nestjs',
        link: 'https://github.com/juliandavidmr/awesome-nestjs',
        description: '😏 Curated list of NestJS'
      }, {
        title: 'sails-inverse-model',
        link: 'https://github.com/juliandavidmr/sails-inverse-model',
        description: 'Generate views, models and controllers for SailsJS from MySQL, PostgreSQL and MongoDB'
      }, {
        title: 'vue-frame',
        link: 'https://github.com/juliandavidmr/vue-frame',
        description: 'Dynamic component for creation of interfaces with iframes'
      }, {
        title: 'me',
        link: 'https://github.com/juliandavidmr/me',
        description: 'This blog'
      }, {
        title: 'sylver',
        link: 'https://github.com/juliandavidmr/sylver',
        description: '❄️A lightweight math library for JavaScript'
      }, {
        title: 'StarkMap API',
        link: 'https://github.com/juliandavidmr/StarkMap_API',
        description: 'Visualizacion de recursos fisicos de la universidad de la Amazonia'
      }
    ]
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID || `none`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
