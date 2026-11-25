import { Editor } from './Editor';
import { RoleFields, readProfile } from './RoleFields';

export function RoleForm({ path, profile, saved, catalog }) {
  return <Editor path={path} item={profile} saved={saved} read={readProfile} label="Guardar perfil"
    disabled={catalog.loading || !!catalog.error}>
    <RoleFields profile={profile} catalog={catalog} />
  </Editor>;
}
