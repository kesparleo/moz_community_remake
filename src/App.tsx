import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CollaborationInbox from "./components/Collaborate/CollaborateButton";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Communities from "./components/List/List";
import Navbar from "./components/Navbar/Navbar";
import ScrollTopButton from "./components/ScrollTopButton/ScrollTopButton";
import CommunityProfile from "./components/CommunityProfile/CommunityProfile";
import ScrollToTop from "./components/ScrollToTop";

const communityName = "MozCommunities";
const githubUrl = "https://github.com/kesparleo/moz_community_remake";
const author = "Kespar";
const authorUrl = "https://linktr.ee/leokespar";
const inspiration = "MozComunidades";
const inspirationUrl = "https://mozcomunidades.web.app";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <Router>
      <ScrollTopButton />
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
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
                description="Está pagina foi criada exclusivamente para listar as comunidades de técnologia e programação existentes em Moçambique. É provável que não estejam todas na lista, para isso criamos um meio de submissão abaixo de comunidades para posterior publicação na página."
                buttonText="Apreciar"
                buttonUrl="#communities"
                githubUrl={githubUrl}
              />
              <Communities />
              <CollaborationInbox />
            </>
          }
        />

        <Route
          path="/community/:id"
          element={
            <CommunityProfile
              theme={theme}
              setTheme={setTheme}
            />
          }
        />
      </Routes>

      <Footer
        copyrightHolderName={inspiration}
        copyrightHolderUrl={inspirationUrl}
        redesignAuthorName={author}
        redesignAuthorUrl={authorUrl}
      />
    </Router>
  );
}

export default App;
