import fs from 'fs';
import YAML from 'yaml'
import {MyUser} from './user-repository';

export const loadConfig = <App extends {[key: string]: any}>() => {
  const file = fs.readFileSync(__dirname + '/../data/config.yml', 'utf8')
  let raw = YAML.parse(file);
  // TODO validate config
  return {
    issuer: raw.issuer,
    registeredApps: (raw.apps||[]).reduce((prev: Record<string, App>, app:App)=>({...prev, [app.id]: app}), {}),
    users: raw.users,
    usersMap: (raw.users||[]).reduce((prev: Record<string, MyUser>, user: MyUser)=>({...prev, [user.id]: user}), {}),
  }
}