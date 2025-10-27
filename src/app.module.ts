import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from 'nestjs-schedule';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBconfig } from './config';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { config } from 'dotenv';
// import { AddressesModule } from './modules/addresses/addresses.module';
import { PropertiesModule } from './modules/properties/properties.module';
// import { CompanyProfileModule } from './modules/company-profile/company-profile.module';
// import { AgentsModule } from './modules/agents/agents.module';

import { LocationModule } from './modules/location/location.module';
import { SocialLinks } from './modules/social-links/entities/social-links.entity';

// import { FirebaseModule } from './core/database/config/firebase/firebase.module';
import { TokenModule } from './modules/users/token.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CalendarsModule } from './modules/calendars/calendars.module';

import { RolesGuard } from './common/guards/roles.guard';
import { OrdersModule } from './modules/orders/orders.module';



config();

console.log('env--->', DBconfig.host, DBconfig.port, DBconfig.username, DBconfig.password, DBconfig.database);


@Module({ 
  imports: [
    TypeOrmModule.forRoot(
      {
          type: 'postgres',
          host: DBconfig.host,
          port: DBconfig.port,
          username: DBconfig.username,
          password: DBconfig.password,
          database: DBconfig.database,
          // entities: [`${__dirname}../../**/**.entity{.ts,.js}`],
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: true,
          // ssl: {rejectUnauthorized: false},
          ssl: process.env.NODE_ENV === 'local' ? false : { rejectUnauthorized: false },
        }
    ),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    UsersModule,
    OrdersModule,
    // AddressesModule,
    // PropertiesModule,
    // CompanyProfileModule,
    // AgentsModule,
    // MenusModule,
    // PermissionsModule,
    // RolesModule,
    // LeadsModule,
    // LocationModule,
    // SocialLinks,
    // TherapistsModule,
    // StaffModule,
    // SeederModule,
    TokenModule,
    // TeamMemberModule,
    // AppointmentsModule,
    // CalendarsModule,
    // SpecializationModule,
    // BranchesModule,
    // ConsultationsModule,
    // DepartmentsModule,
    // DashboardModule,
  
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //   {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard, 
    // },
  //     {
  //     provide: APP_GUARD,
  //     useClass: RolesGuard, 
  //   },
  ],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('*');
  }
}
