import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { format } from 'date-fns'

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendVerifyMail(email: string, token: string) {
    try {
      const url = `${this.configService.get('APP_URL')}/weather/verify?token=${token}`
      const info = await this.mailerService.sendMail({
        to: email,
        subject: 'Email verify',
        template: './cofirm-register-weather',
        context: {
          url: url,
        },
      })
      console.log('Email sent: ' + info.response)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  public async sendMailDaily(email: string, currentWeather: any) {
    try {
      const info = await this.mailerService.sendMail({
        to: email,
        subject: 'Email daily',
        template: './daily-weather-forecasts',
        context: {
          currentWeather: currentWeather,
        },
      })
      console.log('Email sent: ' + info.response)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}
