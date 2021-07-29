import { spawn, SpawnOptionsWithoutStdio } from 'child_process'
import inquirer from 'inquirer'
import fs from 'fs'
import commander from 'commander'

import pkg from '../package.json'

interface Options {
  clear?: boolean
  all?: boolean
  watch?: boolean
  workspaces?: string[]
  formats?: string[]
}

const doCommand = (
  cmd: string, args?: ReadonlyArray<string>, options: SpawnOptionsWithoutStdio = {
    cwd: process.cwd()
  }
) => new Promise<number>(resolve => {
  if (process.platform === 'win32') cmd += '.cmd'
  console.log('working dir:', options?.cwd)
  console.log(
    `> ${cmd} ${args.join(' ')}`
  )
  const execCmd = spawn(cmd, args, options)
  execCmd.stdout.pipe(process.stdout)
  execCmd.stderr.pipe(process.stderr)
  execCmd.on('exit', code => {
    resolve(code)
  })
})

const runRollup = (args: any[], options: SpawnOptionsWithoutStdio = {}) => Promise.resolve(
  doCommand('rollup', [ '-c', ...args ], options)
)

const buildWorkspaces = async (opts: Options) => {
  for (let i = 0;i < opts.workspaces.length; i++) {
    const workspace = opts.workspaces[i]
    const options = { cwd: `./packages/${workspace}` }

    const rollupArgs = []
    if (opts.watch) rollupArgs.push('--watch')

    if (opts.formats.includes('all')) {
    }

    await Promise.all(opts.formats.map(format => format !== 'dtsc'
      ? runRollup([ '--environment', `FORMAT:${format}`, ...rollupArgs ], options)
      : doCommand('tsc', '-p . --declaration --emitDeclarationOnly'.split(' '), options)
    ))
  }
}

const program = new commander.Command(
    'builder'
  ).version(
    pkg.version
  ).option(
    '--watch', 'watch file change to build.'
  ).option(
    '--clear', 'clear build data.'
  ).option(
    '--all', 'build all workspaces.'
  ).option(
    '--formats [formats...]', 'build target format of workspace.'
  ).option(
    '--workspaces [workspaces...]', 'build target workspaces.'
  ).parse(process.argv)

;(async () => {
  const opts = program.opts() as Options

  if (opts.all) {
    opts.workspaces = fs.readdirSync('./packages')
  }

  if (opts.workspaces.length === 0) {
    opts.workspaces = await inquirer.prompt([{
      type: 'checkbox',
      name: 'workspaces',
      message: '请输入工作空间名',
      choices: fs.readdirSync('./packages')
    }]).then(a => a.workspaces)
  }
  if (opts.clear) {
    opts.workspaces.forEach(workspace => doCommand('rimraf', [ `packages/${workspace}/dist` ]))
  }

  await buildWorkspaces(opts)
})().catch(console.error)
