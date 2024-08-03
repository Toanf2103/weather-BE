import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.error(exception)

    const ctx = host.switchToHttp()
    const res = ctx.getResponse()
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const error =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' }

    res.status(status).json(error)
  }
}
