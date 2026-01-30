import { useEffect, useState } from "react";
import CollaborationInbox from "./components/Collaborate/CollaborateButton";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Communities from "./components/List/List";
import Navbar from "./components/Navbar/Navbar";
import ScrollTopButton from "./components/ScrollTopButton/ScrollTopButton";

const communityName = 'MozCommunities';
const githubUrl = 'https://github.com/kesparleo/moz_community_remake'

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  return (
    <>
      <Navbar
        title={communityName}
        theme={theme}
        setTheme={setTheme}
        items={[
          { id: "home", label: "Home" },
          { id: "communities", label: "List" },
          { id: "contact", label: "Contact" },
        ]}
      />
      <Hero
        title={communityName}
        description={"Está pagina foi criada única e esclusivamente para listar as comunidades de técnologia e programação existêntes em Moçambique. É provavel que não estejam todas na lista para isso criamos um meio de submisão via (PR) de comunidades para posterior publicação na página."}
        buttonText={"Apreciar"}
        buttonUrl={"#communities"} githubUrl={githubUrl}/>
      <Communities/>
      <CollaborationInbox/>
      <Footer />
      <ScrollTopButton/>
    </>
  );
}

export default App;
