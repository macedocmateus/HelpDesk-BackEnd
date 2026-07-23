import type { Config } from 'jest'
import { createDefaultEsmPreset } from 'ts-jest'

const presetConfig = createDefaultEsmPreset()

const config: Config = {
  ...presetConfig,
  testEnvironment: 'node',
  moduleNameMapper: {
    '^#/(.*)\\.js$': '<rootDir>/src/$1.ts',
    '^(\\.\\.?/.*)\\.js$': '$1',
  },
}

export default config
