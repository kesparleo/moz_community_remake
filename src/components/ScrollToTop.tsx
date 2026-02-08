import { useEffect } from "react";
import { useRouter } from "next/router";

const ScrollToTop: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [router.asPath]);

  return null;
};

export default ScrollToTop;
