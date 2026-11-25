import { SkillPicker } from './SkillPicker';
import { Check } from './ui/Check';

export function OpportunityFields({ catalog, profile }) {
  return <>
    <SkillPicker name="habilidades" label="Tus habilidades" catalog={catalog} selected={profile.habilidades} />
    <Check name="aceptaContacto" defaultChecked={profile.aceptaContacto}>Acepto recibir mensajes de colectivos y avisos de oportunidades compatibles.</Check>
  </>;
}
