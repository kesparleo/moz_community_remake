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
}

export const listaData: ListaItem[] = [
  {
    logo: '/assets/images/logo1.png',
    title: 'GDG - Google Developers Group',
    description: 'GDG Maputo é uma comunidade local para desenvolvedores interessados em tecnologias da Google. Em Moçambique, GDG encontra-se em 3 cidades: Maputo, Beira e Tete.',
    social: {
      facebook: 'https://pt-br.facebook.com/groups/gdgmaputo/'
    }
  },
  {
    logo: '/assets/images/logo2.png',
    title: 'QA Community Moz',
    description: 'A primeira comunidade moçambicana dedicada a Quality Assurance (QA) e Testes Automatizados, criada para unir profissionais, partilhar conhecimento e elevar a qualidade do software no país.',
    website: 'https://comunidadeb.com',
    social: {
      whatsapp: 'https://chat.whatsapp.com/BO6tJjlxMyXB2K4AMPPlVm',
      linkedin: 'https://www.linkedin.com/company/qa-community-moz/'
    }
  },
  {
    logo: '/assets/images/logo3.png',
    title: 'Pyladies Maputo',
    description: 'Somos uma comunidade com foco em ajudar mais mulheres a se tornarem participantes activas e líderes na comunidade de código aberto Python. Venha pelo Python e fica pela Comunidade 🐍',
    website: 'https://comunidadec.com',
    social: {
      facebook: 'https://facebook.com/comunidadec',
      instagram: 'https://instagram.com/comunidadec',
      twitter: 'https://x.com/PyLadiesMaputo',
      linkedin: 'https://www.linkedin.com/company/pyladies-maputo/',
      whatsapp: 'https://chat.whatsapp.com/IVxKNCPTbZH9xbjpHxuBA2'
    }
  },
  {
    logo: '',
    title: 'DSAI For Moz',
    description: 'Somos uma comunidade moçambicana dedicada a promover Data Science, Artificial Intelligence (AI) e inovação tecnológica. Junte-se a nós para aprender, compartilhar e crescer no mundo dos dados e da inteligência artificial!',
    website: 'https://dsai.co.mz/',
    social: {
      whatsapp: 'https://chat.whatsapp.com/IcqlFviLiHIBD3DBNBXfgc',
      linkedin: 'https://www.linkedin.com/company/dsai-for-moz'
    }
  },
  {
    logo: '',
    title: 'Django Girls Moz',
    description: 'Django Girls é um workshop com duração de um dia, sobre programação em Python e Django focado especialmente para mulheres',
    website: 'https://dsai.co.mz/',
    social: {
      whatsapp: 'https://chat.whatsapp.com/7ufLDMUUPFO54UHmqH8rR8',
      linkedin: 'https://www.linkedin.com/company/djangogirlsmoz',
      twitter: 'https://twitter.com/djangogirlsmoz',
      instagram: 'https://www.instagram.com/djangogirlsmoz/'
    }
  }
];
