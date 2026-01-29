import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Communities from "./components/List/List";
import Navbar from "./components/Navbar/Navbar";
import ScrollTopButton from "./components/ScrollTopButton/ScrollTopButton";

function App() {
  return (
    <>
      <Navbar/>
      <Hero
        title={"MozComunidades"}
        description={"Está pagina foi criada única e esclusivamente para listar as comunidades de técnologia e programação existêntes em Moçambique. É provavel que não estejam todas na lista para isso criamos um meio de submisão via (PR) de comunidades para posterior publicação na página."}
        buttonText={"Apreciar"}
        buttonUrl={"#communities"} githubUrl={"https://github.com/kesparleo/moz_community_remake"}/>
      <Communities/>
      <Footer />
      <ScrollTopButton/>
    </>
  );
}

export default App;
