const accountUnauthenticated = [
  {
    id: 'LOG_IN',
    href: '/login',
    external: false,
  },
  {
    id: 'REQUEST_INVITE',
    href: '/request',
    external: false,
  },
  {
    id: 'HOME',
    href: '/',
    external: false,
  },
];

const accountAuthenticated = [
  {
    id: 'HOME',
    href: '/',
    external: false,
  },
  {
    id: 'INDIVIDUALS',
    href: '/individuals',
    external: false,
  },
  {
    id: 'SIGHTINGS',
    href: '/sightings',
    external: false,
  },
  // {
  //   id: 'ORGANIZATIONS',
  //   href: '/orgs',
  //   external: false,
  // },
  // {
  //   id: 'PROJECTS',
  //   href: '/projects',
  //   external: false,
  // },
];

const resources = [
  {
    id: 'DOCUMENTATION',
    href: 'https://docs.wildme.org/',
    external: true,
  },
  {
    id: 'COMMUNITY_FORUMS',
    href: 'https://community.wildme.org/',
    external: true,
  },
  {
    id: 'LEGAL',
    href: 'https://www.wildme.org/#/legal',
    external: true,
  },
];

const contribute = [
  {
    id: 'REPORT_SIGHTINGS',
    href: '/report',
    external: false,
  },
  // {
  //   id: 'ADOPT',
  //   href: '/adopt',
  //   external: false,
  // },
  {
    id: 'DONATE',
    href: 'https://wildme.org/#/donate',
    external: true,
  },
];

const social = [
  {
    id: 'INSTAGRAM',
    href: 'https://www.instagram.com/wildmeorg',
    customHref: 'site.links.instagramLink',
    external: true,
  },
  {
    id: 'TWITTER',
    href: 'https://twitter.com/WildMeOrg',
    customHref: 'site.links.twitterLink',
    external: true,
  },
  {
    id: 'FACEBOOK',
    href: 'https://facebook.com/WildMeOrg',
    customHref: 'site.links.facebookLink',
    external: true,
  },
  {
    id: 'GITHUB',
    href: 'https://github.com/WildMeOrg/codex-frontend',
    external: true,
  },
];

export default {
  accountAuthenticated,
  accountUnauthenticated,
  contribute,
  resources,
  social,
};
