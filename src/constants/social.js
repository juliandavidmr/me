import { faMicroblog, faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export default [
    {
        kind: 'Blog',
        icon: faMicroblog,
        url: '/posts',
        text: 'Writing',
        principal: true
    },
    {
        kind: 'GitHub',
        icon: faGithub,
        url: 'https://github.com/juliandavidmr',
        text: 'Code',
        principal: true
    },
    {
        kind: 'Twitter',
        icon: faTwitter,
        url: 'https://twitter.com/anlijudavid',
        text: 'Tweets',
        principal: true
    },
    {
        kind: 'LinkedIn',
        icon: faLinkedin,
        url: 'https://www.linkedin.com/in/juli%C3%A1n-david-mora-ramos-21514b93/',
        text: 'Social',
        principal: false
    }
];