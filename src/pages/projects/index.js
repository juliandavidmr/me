import React from 'react'
import { graphql, Link, useStaticQuery } from "gatsby"
import Layout from "../../components/layout";
import SEO from '../../components/seo';

import './projects.css';

const ProjectsPage = ({ location }) => {
    const data = useStaticQuery(graphql`
        query {
            site {
                siteMetadata {
                    title
                    projects {
                        title
                        link
                        description
                    }
                }
            }
        }
    `)

    const { projects, title } = data.site.siteMetadata;

    return (
        <Layout location={location} title={title}>
            <SEO title="Projects" />

            <div className="projects-page">
                <h2>Projects</h2>

                {
                    projects.map(project => {
                        return (
                            <div key={project.title}>
                                <h3>
                                    <a href={project.link} target="_blank">
                                        {project.title}
                                    </a>
                                </h3>
                                <p>{project.description}</p>
                            </div>
                        );
                    })
                }
            </div>
        </Layout>
    );
}

export default ProjectsPage;