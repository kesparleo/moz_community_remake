export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  whatsapp?: string;
  [key: string]: string | undefined;
}

export interface ListaItem {
  logo: string;
  title: string;
  description: string;
  website?: string;
  social: SocialLinks;
  color: String;
}

export const listaData: ListaItem[] = [
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQGbZY6Q5sgsEA/company-logo_200_200/B4DZiPlE7PH8AI-/0/1754755518848/qa_community_moz_logo?e=1771459200&v=beta&t=HDsfj-w9EiFgwLDd2XTFybqbK2Bw9KpIjHeWK_ySr60',
    title: 'QA Community Moz',
    description: 'A primeira comunidade moçambicana dedicada a Quality Assurance (QA) e Testes Automatizados, criada para unir profissionais, partilhar conhecimento e elevar a qualidade do software no país.',
    website: 'https://comunidadeb.com',
    social: {
      whatsapp: 'https://chat.whatsapp.com/BO6tJjlxMyXB2K4AMPPlVm',
      linkedin: 'https://www.linkedin.com/company/qa-community-moz/'
    },
    color: '#31378aff'
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQFtj0fOo53rkQ/company-logo_200_200/company-logo_200_200/0/1695041071092?e=1771459200&v=beta&t=FK0UsiTT_DFA43z-7SqaME2-Jaq2SreuuDYaE8OjdxE',
    title: 'Pyladies Maputo',
    description: 'Somos uma comunidade com foco em ajudar mais mulheres a se tornarem participantes activas e líderes na comunidade de código aberto Python. Venha pelo Python e fica pela Comunidade 🐍',
    website: 'https://comunidadec.com',
    social: {
      facebook: 'https://facebook.com/comunidadec',
      instagram: 'https://instagram.com/comunidadec',
      twitter: 'https://x.com/PyLadiesMaputo',
      linkedin: 'https://www.linkedin.com/company/pyladies-maputo/',
      whatsapp: 'https://chat.whatsapp.com/IVxKNCPTbZH9xbjpHxuBA2'
    },
    color: '#6e318aff'
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQEq9FQO8CF3cg/company-logo_200_200/company-logo_200_200/0/1729162204438/dsai_for_moz_logo?e=1771459200&v=beta&t=nQUQeTZmjqYh1fzvri1vONGMd3GjeGGpj8pA5t-ksoo',
    title: 'DSAI For Moz',
    description: 'Somos uma comunidade moçambicana dedicada a promover Data Science, Artificial Intelligence (AI) e inovação tecnológica. Junte-se a nós para aprender, compartilhar e crescer no mundo dos dados e da inteligência artificial!',
    website: 'https://dsai.co.mz',
    social: {
      whatsapp: 'https://chat.whatsapp.com/IcqlFviLiHIBD3DBNBXfgc',
      linkedin: 'https://www.linkedin.com/company/dsai-for-moz'
    }
    ,
    color: '#3498db'
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQFu68cby66G8w/company-logo_100_100/company-logo_100_100/0/1682616794107/djangogirlsmoz_logo?e=1771459200&v=beta&t=qgc_Iy3Q4-MqIj68IX51WvfpghRjyzUXGoPxWtZi1EM',
    title: 'Django Girls Moz',
    description: 'Django Girls é um workshop com duração de um dia, sobre programação em Python e Django focado especialmente para mulheres',
    website: 'https://dsai.co.mz',
    social: {
      whatsapp: 'https://chat.whatsapp.com/7ufLDMUUPFO54UHmqH8rR8',
      linkedin: 'https://www.linkedin.com/company/djangogirlsmoz',
      twitter: 'https://twitter.com/djangogirlsmoz',
      instagram: 'https://www.instagram.com/djangogirlsmoz/'
    },
    color: '#e98834ff'
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQEJWR8lFdk6yw/company-logo_200_200/company-logo_200_200/0/1698048505986?e=1771459200&v=beta&t=33Eek2w7C_8tMSIxhW0mJKHGAWvhw3mUrdopZrvHhg4',
    title: 'MozDevz',
    description: 'A maior comunidade de desenvolvedores de Moçambique',
    website: 'https://www.mozdevz.org',
    social: {
      facebook: 'https://www.facebook.com/mozdevz/',
      linkedin: 'https://www.linkedin.com/company/mozdevz/'
    },
    color: '#5e5e5eff'
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQFYkGScKvniSA/company-logo_200_200/company-logo_200_200/0/1728759049864/data_driven_communitymz_logo?e=1771459200&v=beta&t=_WLPuqdHsPl6QpGaDzq6HCgZVGX5PJXpz1ti_pfiCLk',
    title: 'Data Driven CommunityMZ',
    description: 'A **Data Driven Community** é um espaço dinâmico dedicado a conectar profissionais de dados e tecnologia. Aqui, promovemos a troca de conhecimentos, o aprendizado contínuo e a colaboração entre membros, com foco em discutir tendências, melhores práticas e inovações na área. Junte-se a nós para compartilhar experiências, participar de eventos e transformar dados em soluções impactantes!',
    website: 'https://www.mozdevz.org',
    social: {
    },
    color: ''
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQE1eJmFJGGJfg/company-logo_200_200/company-logo_200_200/0/1724060766992/maputo_frontenders_logo?e=1771459200&v=beta&t=WnKLhla8YenTe_QCE-3GpCGiwh4ETuGZknVUQFul7kY',
    title: 'Maputo Frontenders',
    description: 'A maior comunidade de desenvolvedores frontend em Maputo',
    website: 'https://www.maputofrontenders.dev',
    social: {
      instagram: 'https://www.instagram.com/mptfrontenders',
      linkedin: 'https://linkedin.com/company/maputo-frontenders',
      twitter: 'https://twitter.com/mptfrontenders'
    },
    color: '#000'
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQE5yJ5cQ9PJcw/company-logo_200_200/company-logo_200_200/0/1680002627533?e=1771459200&v=beta&t=qLsSZp-asWguFQD94rZqUQhu72FPNwxHvZEj6foKI_Y',
    title: 'Flutter Moçambique',
    description: 'Capacitando desenvolvedores moçambicanos em Flutter para criar aplicações inovadoras e multiplataforma.',
    website: 'https://www.maputofrontenders.dev',
    social: {
      whatsapp: 'https://chat.whatsapp.com/LDCa69V6G6m2EPvHlLEjiz'
    },
    color: '#1abc9c'
  },
  {
    logo: 'https://mozcomunidades.web.app/images/comunities/laravelmaputocommunity.png',
    title: 'Laravel Maputo Commnunity',
    description: 'Grupo dedicado ao intercâmbio de diversos interessados do mundo Laravel, canal onde diversas mentes podem unir seu potêncial para resolver questões do dia a dia e divertir-se.',
    website: 'https://www.maputofrontenders.dev',
    social: {
      whatsapp: 'https://chat.whatsapp.com/BBsDgZGoLZmBEyVXZS8fy2'
    },
    color: '#c0392b'
  },
  {
    logo: 'https://mozcomunidades.web.app/images/comunities/jsmaputocommunity.png',
    title: 'JS Maputo Commnunity',
    description: 'Criada para se abordar, debater, assuntos relacionados ao JavaScript e suas técnologias complementares.',
    website: '',
    social: {
      instagram: 'https://instagram.com/jsmaputocommunity',
      twitter: 'hhttps://twitter.com/jsmaputocomm',
      facebook: 'https://facebook.com/jsmaputocommunity',
      whatsapp: 'https://chat.whatsapp.com/1ZXaVqxGSM99MbMbnqPtur'
    },
    color: '#8dca2bff'
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQHhhbAfhW4cDg/company-logo_200_200/B4DZV80e8OHwAQ-/0/1741555890716?e=1771459200&v=beta&t=sWSsyC-HCzqfeoWruwjFhtU__IKPid45p1vTTU2QOCc',
    title: 'MozCyber',
    description: 'Capacitando a próxima geração de especialistas em cibersegurança em Moçambique!',
    website: 'https://www.mozcyber.org/',
    social: {
      linkedin: 'https://www.linkedin.com/company/mozcyber',
      instagram: 'https://www.instagram.com/mozcyberr'
    },
    color: '#141414ff'
  }
];
