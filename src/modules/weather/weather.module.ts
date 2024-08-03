import { Module } from '@nestjs/common'
import { WeatherController } from './weather.controller'
import { WeatherService } from './weather.service'
import { EmailService } from '../email/email.service'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WeatherNotification } from '@/database/entities'

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([WeatherNotification])],
  controllers: [WeatherController],
  providers: [WeatherService, EmailService],
})
export class WeatherModule {}
