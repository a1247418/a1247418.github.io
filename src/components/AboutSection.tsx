
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutSection = () => {
  return (
    <Card className="bg-white/80 border-warmBrown/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-warmBrown font-mono">About</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-warmBrown max-w-none">
        <p className="text-warmBrown/80 leading-relaxed mb-4">
          I am a research assistant with <a href="https://web.ml.tu-berlin.de/author/prof.-dr.-klaus-robert-muller/">Prof. Müller</a> at the
            Machine Learning group at the Technical University of Berlin (Technische Universität Berlin / TU Berlin).
          My research interests lie in understanding <i>how</i> and <i>what</i> machine learning models represent and
            how to use this to increase their robustness or improve their performance.
        </p>
        <p className="text-warmBrown/80 leading-relaxed mb-4">
          Before joining TU Berlin, I completed my MSc in Computer Science at
          ETH Zurich, and my BSc in Computer Science at University of Vienna.
          I am especially indebted to my supervisors, <a href="https://www.bifold.berlin/people/prof-dr-gregoire-montavon.html">Grégoire Montavon</a>, <a href="https://schwabpatrick.com/">Patrik Schwab</a> and <a href="https://geschichte.univie.ac.at/en/persons/torsten-moeller">Torsten Möller</a>.
        </p>
        <p className="text-warmBrown/80 leading-relaxed">
          When I'm not researching, I enjoy hiking, painting & generative art.
        </p>
      </CardContent>
    </Card>
  );
};

export default AboutSection;
