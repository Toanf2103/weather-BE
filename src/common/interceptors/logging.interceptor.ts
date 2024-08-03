import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { format } from 'date-fns'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { DATE_FORMAT } from '../configs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const method = request.method
    const url = request.url
    const userId = request.user?.id ?? 'Anonymous'
    const body = JSON.stringify(request.body)
    const now = Date.now()

    return next.handle().pipe(
      tap(() => {
        const statusCode = context.switchToHttp().getResponse().statusCode
        const delay = Date.now() - now
        console.info(
          `\n[HTTP_REQUEST] [${format(new Date(), DATE_FORMAT.DATE_TIME_DASH)}] API: ${url} - METHOD: ${method} - USER_ID: ${userId} - BODY: ${body} - STATUS CODE: ${statusCode} - TIME: ${delay} ms`,
        )
      }),
    )
  }
}
