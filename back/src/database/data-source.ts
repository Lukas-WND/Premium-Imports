import { DataSourceOptions, DataSource } from 'typeorm';
import { config } from 'dotenv';

config();
export const dataSourceOptions: DataSourceOptions = {
  type: 'mariadb',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [`dist/**/*.entity{.js, .ts}`],
  synchronize: true,
};

const dataSource: DataSource = new DataSource(dataSourceOptions);
export default dataSource;
