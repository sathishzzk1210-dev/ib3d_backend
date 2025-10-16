// data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { DBconfig } from './src/config';
import { Patient } from './src/modules/customers/entities/patient.entity';
import { Address } from './src/modules/addresses/entities/address.entity';
import { Therapist } from './src/modules/therapist/entities/therapist.entity';
// import { Staff } from './src/modules/StaffType/entities/staff.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import User from 'src/modules/users/entities/user.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderItem } from 'src/modules/orders/entities/order-item.entity';
import { OrderFile } from 'src/modules/orders/entities/order-file.entity';
import { OrderTimeline } from 'src/modules/orders/entities/order-timeline.entity';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DBconfig.host,
  port: DBconfig.port,
  username: DBconfig.username,
  password: DBconfig.password,
  database: DBconfig.database,
  entities: [
    User,
    Order,
    OrderItem,
    OrderFile,
    OrderTimeline,
    // Patient,
    // Address,
    // Therapist,
    // // Staff,
    // Role,
    // Permission,
    // User,
    // // SocialLinks,
    // Menu,
    // Branch,
    // Token,
    // TeamMember,
    // Consultation,
    // Department,
    // Specialization,
    // Language,
   // `${__dirname}/src/modules/**/entities/*.entity{.ts,.js}`
  ],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
  ssl: DBconfig.ssl,
});
