import React from "react"
import { AnimatedSection } from "../../../shared/components/ui/AnimatedSection"
import AboutHero from "../components/about/AboutHero"
import AboutMission from "../components/about/AboutMission"
import AboutFeatures from "../components/about/AboutFeatures"
import AboutCTA from "../components/about/AboutCTA"
import AboutActors from "../components/about/AboutActors"
import Footer from "../../../shared/components/footer/Footer"

const About = () => {
  return (
    <AnimatedSection direction="bottom">
      <AboutHero />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
        <AboutMission />
        <AboutFeatures />
        <AboutActors />
      </div>

      <AboutCTA />
      <Footer />
    </AnimatedSection>
  )
}

export default About
