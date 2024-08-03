import { Module } from '@nestjs/common'
import { WeatherController } from './weather.controller'
import { WeatherService } from './weather.service'
import { EmailService } from '../email/email.service'

@Module({
  imports: [],
  controllers: [WeatherController],
  providers: [WeatherService, EmailService],
})
export class WeatherModule {}
