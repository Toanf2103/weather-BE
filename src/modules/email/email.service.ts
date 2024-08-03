import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { format } from 'date-fns'

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail() {
    try {
      const info = await this.mailerService.sendMail({
        to: 'hello@gmail.com',
        subject: 'Daily weather forecast',
        template: './daily-weather',
        context: {
          time: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        },
      })
      console.log('Email sent: ' + info.response)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}
