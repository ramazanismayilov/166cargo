import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ClsModule } from 'nestjs-cls';
import { Request } from 'express';
import { AuthModule } from './modules/auth/auth.module';
import { StationModule } from './modules/station/station.module';
import { UserModule } from './modules/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UploadModule } from './modules/upload/upload.module';
import { NewsModule } from './modules/news/news.module';
import { TariffModule } from './modules/tariff/tariff.module';
import { GeneralModule } from './modules/general/general.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          url: config.get('DATABASE_URL'),
          entities: [join(__dirname, '/entities/*.entity.{ts,js}')],
          migrations: [join(__dirname, '/migrations/*.{ts,js}')],
          logging: true,
          synchronize: true,
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          secret: config.get('JWT_SECRET'),
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req: Request) => {
          cls.set('ip', req.ip);
        },
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          transport: {
            service: 'gmail',
            host: config.get('SMTP_HOST'),
            port: config.get('SMTP_PORT'),
            secure: config.get('SMTP_SECURE'),
            auth: {
              user: config.get('SMTP_USER'),
              pass: config.get('SMTP_PASSWORD'),
            },
          },
          defaults: {
            from: `"166 Cargo" <${config.get('SMTP_FROM')}>`,
          },
          template: {
            dir: join(__dirname, '..', 'src', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    AuthModule,
    UserModule,
    StationModule,
    UploadModule,
    NewsModule,
    TariffModule,
    GeneralModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
