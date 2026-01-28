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
  website: string;
  social: SocialLinks;
}

export const listaData: ListaItem[] = [
  {
    logo: '/assets/images/logo1.png',
    title: 'Moz Comunidade A',
    description: 'Uma comunidade dedicada a partilhar conhecimento em SEO e marketing digital.',
    website: 'https://comunidadea.com',
    social: {
      facebook: 'https://facebook.com/comunidadea',
      twitter: 'https://twitter.com/comunidadea',
      instagram: 'https://instagram.com/comunidadea'
    }
  },
  {
    logo: '/assets/images/logo2.png',
    title: 'Moz Comunidade B',
    description: 'Focada em tecnologias web e desenvolvimento front-end.',
    website: 'https://comunidadeb.com',
    social: {
      twitter: 'https://twitter.com/comunidadeb',
      linkedin: 'https://linkedin.com/company/comunidadeb'
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
  }
];
