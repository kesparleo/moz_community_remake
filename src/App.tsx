import { useEffect, useState } from "react";
import CollaborationInbox from "./components/Collaborate/CollaborateButton";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Communities from "./components/List/List";
import Navbar from "./components/Navbar/Navbar";
import ScrollTopButton from "./components/ScrollTopButton/ScrollTopButton";
import { Helmet, HelmetProvider } from "react-helmet-async";

const communityName = "MozCommunities";
const githubUrl = "https://github.com/kesparleo/moz_community_remake";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <HelmetProvider>
      <Helmet>
        <title>{communityName} | Comunidades de Tecnologia em Moçambique</title>
        <meta
          name="description"
          content="Lista de comunidades de tecnologia e programação em Moçambique. Submeta a sua comunidade para ser publicada."
        />
      </Helmet>
      <Navbar
        title={communityName}
        theme={theme}
        setTheme={setTheme}
        items={[
          { id: "home", label: "Topo" },
          { id: "communities", label: "Lista" },
          { id: "contact", label: "Contacto" },
        ]}
      />
      <Hero
        title={communityName}
        description={
          "Está pagina foi criada esclusivamente para listar as comunidades de técnologia e programação existêntes em Moçambique. É provavel que não estejam todas na lista para isso criamos um meio de submisão abaixo de comunidades para posterior publicação na página."
        }
        buttonText={"Apreciar"}
        buttonUrl={"#communities"}
        githubUrl={githubUrl}
      />
      <Communities />
      <CollaborationInbox />
      <Footer />
      <ScrollTopButton />
    </HelmetProvider>
  );
}

export default App;
