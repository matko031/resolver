import { Dialect } from 'sequelize'
import path from 'path'
import { config as DotEnvConfig } from 'dotenv'

if (process.env.NODE_ENV == 'test') {
    const env_path = path.resolve(__dirname, '..', '.env.test')
    DotEnvConfig({ path: env_path })
} else if (process.env.NODE_ENV == 'test') {
    const env_path = path.resolve(__dirname, '..', '.env.cicd')
    DotEnvConfig({ path: env_path })
} else {
    DotEnvConfig()
}

type Environment = 'development' | 'production' | 'test' | 'cicd'

type EnvironmentVariables = {
    readonly env: Environment
    readonly port: number
    readonly database_name: string
    readonly database_username: string
    readonly database_password: string
    readonly database_host: string
    readonly database_dialect: Dialect
    readonly auth_token: string
}

type EnvironmentConfig<T> = {
    [K in Environment]: T
}

type Unparsed = Partial<EnvironmentVariables>

const getEnv = (): Environment =>
    (process.env.NODE_ENV as Environment) || 'development'

// Loading process.env as ENV interface

const getConfig = (node_env: string): Unparsed => {
    // config shared for all environments
    const generalConfig = {
        database_name: process.env.DATABASE_NAME!,
        database_username: process.env.DATABASE_USERNAME!,
        database_password: process.env.DATABASE_PASSWORD!,
        database_host: process.env.DATABASE_HOST!,
        database_dialect: process.env.DATABASE_DIALECT as Dialect,
        auth_token: process.env.AUTH_TOKEN!,
    }

    const environments: EnvironmentConfig<Unparsed> = {
        development: {
            env: 'development',
            port: process.env.PORT ? Number(process.env.PORT) : 3000,
            ...generalConfig,
        },
        production: {
            env: 'production',
            port: Number(process.env.PORT),
            ...generalConfig,
        },
        test: {
            env: 'test',
            port: process.env.PORT ? Number(process.env.PORT) : 3000,
            ...generalConfig,
        },
    }
    return environments[node_env as Environment]
}

// Throwing an Error if any field was undefined we don't want our app to
// run if it can't connect to DB and ensure that these fields are accessible.
// If all is good return it as Config which just removes the undefined from our
// type definition.
const assertNonNullable = (variables: Unparsed) => {
    Object.keys(variables).forEach((key: string) => {
        if (!variables[key as keyof EnvironmentVariables]) {
            throw new Error(`Missing key ${key} in config`)
        }
    })
}

const config: Unparsed = getConfig(getEnv())
assertNonNullable(config)
export default config
