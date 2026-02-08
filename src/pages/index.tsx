import Hero from '../components/Hero';
import Communities from '../components/List';
import Navbar from '../components/Navbar';
import CollaborationInbox from '../components/CollaborateButton';
import Footer from '../components/Footer';
import ScrollTopButton from '../components/ScrollTopButton';
import ScrollToTop from '../components/ScrollToTop';
import { githubUrl, mail, inspiration, inspirationUrl, author, authorUrl } from '../data/personal';

interface Props {
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}

export default function Home({ theme, setTheme }: Props) {
  return (
    <>
      <ScrollTopButton />
      <ScrollToTop />
      <Navbar
        theme={theme}
        setTheme={setTheme}
        items={[
          { id: 'home', label: 'Topo' },
          { id: 'communities', label: 'Lista' },
          { id: 'contact', label: 'Contacto' },
        ]}
      />
      <Hero
        description="Está pagina foi criada exclusivamente para listar as comunidades de técnologia e programação existentes em Moçambique. É provável que não estejam todas na lista, para isso criamos um meio de submissão abaixo de comunidades para posterior publicação na página."
        buttonText="Apreciar"
        buttonUrl="#communities"
      />
      <Communities />
      <CollaborationInbox githubUrl={githubUrl} mail={mail} />
      <Footer
        copyrightHolderName={inspiration}
        copyrightHolderUrl={inspirationUrl}
        redesignAuthorName={author}
        redesignAuthorUrl={authorUrl}
      />
    </>
  );
}
