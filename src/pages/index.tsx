import Hero from '../components/Hero';
import Communities from '../components/List';
import CollaborationInbox from '../components/CollaborateButton';
import Footer from '../components/Footer';
import ScrollTopButton from '../components/ScrollTopButton';
import ScrollToTop from '../components/ScrollToTop';
import { githubUrl, mail, inspiration, inspirationUrl, author, authorUrl } from '../data/personal';

export default function Home() {
  return (
    <>
      <ScrollTopButton />
      <ScrollToTop />
      <Hero
        description="Está pagina foi criada para servir de guia entre as comunidades de técnologia existentes em Moçambique. É provável que não estejam todas na lista, para isso criamos um meio de submissão abaixo de comunidades para posterior publicação na página."
      />
      <Communities />
      <hr />
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
