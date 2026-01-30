export type Category =
  | "Coding"
  | "Artificial Intelligence"
  | "Data"
  | "Networks"
  | "Cybersecurity";

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  whatsapp?: string;
  telegram?: string;
  youtube?: string;
  github?: string;
  [key: string]: string | undefined;
}

export interface ListaItem {
  logo: string;
  title: string;
  description: string;
  website?: string;
  mail?: string;
  social: SocialLinks;
  color: String;
  categories: Category[];
}

export const listaData: ListaItem[] = [
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQGbZY6Q5sgsEA/company-logo_200_200/B4DZiPlE7PH8AI-/0/1754755518848/qa_community_moz_logo?e=1771459200&v=beta&t=HDsfj-w9EiFgwLDd2XTFybqbK2Bw9KpIjHeWK_ySr60',
    title: 'QA Community Moz',
    description: 'A primeira comunidade moçambicana dedicada a Quality Assurance (QA) e Testes Automatizados, criada para unir profissionais, partilhar conhecimento e elevar a qualidade do software no país.',
    website: '',
    social: {
      whatsapp: 'https://chat.whatsapp.com/BO6tJjlxMyXB2K4AMPPlVm',
      linkedin: 'https://www.linkedin.com/company/qa-community-moz/'
    },
    color: '#31378aff',
    categories: ['Coding']
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQFtj0fOo53rkQ/company-logo_200_200/company-logo_200_200/0/1695041071092?e=1771459200&v=beta&t=FK0UsiTT_DFA43z-7SqaME2-Jaq2SreuuDYaE8OjdxE',
    title: 'Pyladies Maputo',
    description: 'Comunidade local que apoia e promove a participação de mulheres na programação em Python, oferecendo encontros, formação prática e redes de apoio para fomentar competências técnicas e inclusão no sector tecnológico em Maputo.',
    website: '',
    mail: 'maputo@pyladies.com',
    social: {
      instagram: 'https://www.instagram.com/pyladiesmaputo',
      twitter: 'https://x.com/pyladiesmaputo',
      linkedin: 'https://www.linkedin.com/company/pyladies-maputo',
      whatsapp: 'https://chat.whatsapp.com/IVxKNCPTbZH9xbjpHxuBA2',
      github: 'https://github.com/pyladies-maputo'
    },
    color: '#6e318aff',
    categories: ['Coding']
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQEq9FQO8CF3cg/company-logo_200_200/company-logo_200_200/0/1729162204438/dsai_for_moz_logo?e=1771459200&v=beta&t=nQUQeTZmjqYh1fzvri1vONGMd3GjeGGpj8pA5t-ksoo',
    title: 'DSAI For Moz',
    description: 'Comunidade orientada para Dados, Ciência de Dados e Inteligência Artificial, focada na construção de capacidade técnica, partilha de conhecimento e promoção de aplicações de data science e IA para resolver desafios locais e ampliar competências no ecossistema tecnológico.',
    website: 'https://dsai.co.mz',
    social: {
      whatsapp: 'https://chat.whatsapp.com/IcqlFviLiHIBD3DBNBXfgc',
      linkedin: 'https://www.linkedin.com/company/dsai-for-moz'
    }
    ,
    color: '#3498db',
    categories: ['Artificial Intelligence']
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQFu68cby66G8w/company-logo_100_100/company-logo_100_100/0/1682616794107/djangogirlsmoz_logo?e=1771459200&v=beta&t=qgc_Iy3Q4-MqIj68IX51WvfpghRjyzUXGoPxWtZi1EM',
    title: 'Django Girls Moz',
    description: 'Workshop de um dia dedicado a Python e Django, direcionado especialmente a mulheres, que visa introduzir programação, desenvolvimento web e boas práticas, oferecendo um ambiente de aprendizagem prático, inclusivo e de empoderamento tecnológico',
    website: '',
    social: {
      whatsapp: 'https://chat.whatsapp.com/7ufLDMUUPFO54UHmqH8rR8',
      linkedin: 'https://www.linkedin.com/company/djangogirlsmoz',
      twitter: 'https://twitter.com/djangogirlsmoz',
      instagram: 'https://www.instagram.com/djangogirlsmoz'
    },
    color: '#e98834ff',
    categories: ['Coding']
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQEJWR8lFdk6yw/company-logo_200_200/company-logo_200_200/0/1698048505986?e=1771459200&v=beta&t=33Eek2w7C_8tMSIxhW0mJKHGAWvhw3mUrdopZrvHhg4',
    title: 'MozDevz',
    description: 'Maior comunidade tecnológica de Moçambique, reunindo desenvolvedores, estudantes e profissionais de TI, com foco em programação, cibersegurança, inovação e projectos colaborativos, promovendo capacitação, eventos e networking no ecossistema digital nacional.',
    website: 'https://www.mozdevz.org',
    mail: 'contacto@mozdevz.org',
    social: {
      facebook: 'https://www.facebook.com/mozdevz',
      linkedin: 'https://www.linkedin.com/company/mozdevz',
      instagram: 'https://www.instagram.com/mozdevz',
      twitter: 'https://x.com/mozdevz',
      telegram: 'https://t.me/MozDevz',
      youtube: 'https://www.youtube.com/@mozdevz6592',
      whatsapp: 'https://chat.whatsapp.com/LqHu2T0jIJT74U8Q04gKEn',
      github: 'https://github.com/mozdevz'
    },
    color: '#5e5e5eff',
    categories: ['Coding']
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQFYkGScKvniSA/company-logo_200_200/company-logo_200_200/0/1728759049864/data_driven_communitymz_logo?e=1771459200&v=beta&t=_WLPuqdHsPl6QpGaDzq6HCgZVGX5PJXpz1ti_pfiCLk',
    title: 'Data Driven CommunityMZ',
    description: 'Um espaço dinâmico dedicado a conectar profissionais de dados e tecnologia. Aqui, promovemos a troca de conhecimentos, o aprendizado contínuo e a colaboração entre membros, com foco em discutir tendências, melhores práticas e inovações na área. Junte-se a nós para compartilhar experiências, participar de eventos e transformar dados em soluções impactantes!',
    website: '',
    social: {
      linkedin: 'https://www.linkedin.com/company/data-driven-communitymz',
    },
    color: '',
    categories: ['Data']
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQE1eJmFJGGJfg/company-logo_200_200/company-logo_200_200/0/1724060766992/maputo_frontenders_logo?e=1771459200&v=beta&t=WnKLhla8YenTe_QCE-3GpCGiwh4ETuGZknVUQFul7kY',
    title: 'Maputo Frontenders',
    description: 'Grupo de entusiastas e profissionais de front-end em Maputo que promovem a troca de experiências sobre tecnologias web (HTML, CSS, JavaScript, frameworks modernos), formação contínua e networking na comunidade local.',
    website: 'https://www.maputofrontenders.dev',
    mail: 'contacto@maputofrontenders.com',
    social: {
      instagram: 'https://www.instagram.com/mptfrontenders',
      linkedin: 'https://linkedin.com/company/maputo-frontenders',
      twitter: 'https://twitter.com/mptfrontenders',
      youtube: 'https://www.youtube.com/@mptfrontenders',
      github: 'https://github.com/Maputo-Frontenders'
    },
    color: '#000',
    categories: ['Coding']
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQE5yJ5cQ9PJcw/company-logo_200_200/company-logo_200_200/0/1680002627533?e=1771459200&v=beta&t=qLsSZp-asWguFQD94rZqUQhu72FPNwxHvZEj6foKI_Y',
    title: 'Flutter Moçambique',
    description: 'Comunidade técnica dedicada ao desenvolvimento com Flutter em Moçambique, focada na partilha de conhecimento, boas práticas, eventos e colaboração entre programadores, estudantes e profissionais da área.',
    website: '',
    mail: 'mozflutter.contact@gmail.com',
    social: {
      whatsapp: 'https://chat.whatsapp.com/LDCa69V6G6m2EPvHlLEjiz',
      twitter: 'https://x.com/mozflutter',
      facebook: 'https://www.facebook.com/flutterMoz',
      instagram: 'https://www.instagram.com/mozflutter',
      linkedin: 'https://www.linkedin.com/company/fluttermoz',
      github: 'https://github.com/mozflutter'
    },
    color: '#1abc9c',
    categories: ['Coding']
  },
  {
    logo: 'https://mozcomunidades.web.app/images/comunities/laravelmaputocommunity.png',
    title: 'Laravel Maputo Commnunity',
    description: 'Grupo dedicado ao intercâmbio de diversos interessados do mundo Laravel, canal onde diversas mentes podem unir seu potêncial para resolver questões do dia a dia e divertir-se.',
    website: 'https://www.maputofrontenders.dev',
    social: {
      whatsapp: 'https://chat.whatsapp.com/BBsDgZGoLZmBEyVXZS8fy2',
    },
    color: '#c0392b',
    categories: ['Coding']
  },
  {
    logo: 'https://mozcomunidades.web.app/images/comunities/jsmaputocommunity.png',
    title: 'JS Maputo Commnunity',
    description: 'Comunidade que reúne programadores e entusiastas para partilhar conhecimento sobre linguagens, frameworks e ferramentas do ecossistema JavaScript, promover encontros técnicos, discutir boas práticas e estimular a colaboração local em desenvolvimento web e aplicações modernas.',
    website: 'https://jsmaputo.web.app/',
    mail: 'info@jsmaputocommunity.org',
    social: {
      instagram: 'https://instagram.com/jsmaputocommunity',
      twitter: 'hhttps://twitter.com/jsmaputocomm',
      facebook: 'https://facebook.com/jsmaputocommunity',
      whatsapp: 'https://chat.whatsapp.com/1ZXaVqxGSM99MbMbnqPtur'
    },
    color: '#8dca2bff',
    categories: ['Coding']
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQHhhbAfhW4cDg/company-logo_200_200/B4DZV80e8OHwAQ-/0/1741555890716?e=1771459200&v=beta&t=sWSsyC-HCzqfeoWruwjFhtU__IKPid45p1vTTU2QOCc',
    title: 'MozCyber',
    description: 'Comunidade técnica independente e auto-organizada dedicada à cibersegurança em Moçambique, centrada na partilha de conhecimento, estudo colectivo de ameaças, práticas defensivas e formação técnica, operando de forma autónoma face a instituições formais.',
    website: 'https://www.mozcyber.org/',
    mail: 'mozcyber.community@gmail.com',
    social: {
      linkedin: 'https://www.linkedin.com/company/mozcyber',
      instagram: 'https://www.instagram.com/mozcyberr'
    },
    color: '#141414ff',
    categories: ['Networks', 'Cybersecurity']
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQFdIuuYirXEnw/company-logo_200_200/B4EZkY7TnrHoAI-/0/1757059825212?e=1771459200&v=beta&t=2xZTMVo9ultY3eItWs-bdVNwqY1_2o80opX4ScZog8A',
    title: 'InfraMZ',
    description: 'Grupo focado em infra-estruturas de redes e sistemas em Moçambique, orientado para a partilha de conhecimento prático, boas práticas operacionais, estudo de arquitecturas e discussão de desafios técnicos na área de infra-estrutura tecnológica.',
    website: '',
    social: {
      linkedin: 'https://www.linkedin.com/company/inframz/',
      instagram: 'https://www.instagram.com/infra.mz/',
      whatsapp: 'https://l.instagram.com/?u=https%3A%2F%2Fchat.whatsapp.com%2FL6ktaUPCW3NJxdRy87bTHH%3Fmode%3Dems_copy_c%26utm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26fbclid%3DPAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnCeXvdaqobN3uiq7DYxG-Vt57iGulem6mc34LZUmTtdxctjUDYYFJhlPnGmc_aem_6nvBhup7oYOOZNObhcobcg&e=AT07whnG8FgGGfAk1lU52dwys1s1KjXq1_3aiojCSEAO5AEVRbfEXdd31g1bVElKxItc0WeGGAXUcKQ_E26qYXd1i4X1Q-aMyHAYBMWKqA'
    },
    color: '#133b10ff',
    categories: ['Networks']
  }
];
