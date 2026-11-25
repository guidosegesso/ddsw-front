import { ArrowRight, CodeXml, Search } from 'lucide-react';

export function ProjectHero() {
  return <section className="hero">
    <div className="hero-content">
      <span className="hero-label"><CodeXml size={17} aria-hidden="true" /> Código a Voluntad</span>
      <h1>Tecnología para<br /><em>causas que importan.</em></h1>
      <p>Encontrá proyectos de organizaciones sociales y aportá tus habilidades para hacerlos realidad.</p>
      <a className="button hero-button" href="#proyectos"><Search size={18} aria-hidden="true" /> Explorar proyectos <ArrowRight size={17} aria-hidden="true" /></a>
    </div>
    <div className="hero-art" aria-hidden="true"><div className="art-grid" /><div className="art-window"><div className="art-toolbar"><i /><i /><i /></div><CodeXml /></div><i className="art-plus">+</i><i className="art-spark">✦</i></div>
  </section>;
}
