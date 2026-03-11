import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutStats from "@/components/about/AboutStats";
import AboutLeadership from "@/components/about/AboutLeadership";
import AboutValues from "@/components/about/AboutValues";
const About = () => {
    return (<div className="min-h-screen bg-background">
      <Header />
      <AboutHero />
      <AboutStats />
      <AboutLeadership />
      <AboutValues />
      <Footer />
    </div>);
};
export default About;
