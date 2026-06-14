import {sync as commandExistSync} from 'command-exists'
import { resolve } from 'path'

const promise: Promise<'npm'|'pnpm'> = new Promise((resolve)=>{
  if(!commandExistSync('pnpm')) return resolve('npm')
  resolve('pnpm')
})

export default promise
