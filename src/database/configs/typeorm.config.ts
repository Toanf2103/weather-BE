import { config } from 'dotenv'
import { DataSource } from 'typeorm'
import { DataSourceOptions } from 'typeorm/data-source'
import { SeederOptions } from 'typeorm-extension'


config()

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/**/migrations/*.{ts,js}'],
}

export default new DataSource(dataSourceOptions)
