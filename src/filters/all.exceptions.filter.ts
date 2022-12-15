import { BaseExceptionFilter } from '@nestjs/core';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { IJsonResult } from '../interfaces/IJsonResult';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const err = exception as Error;
    let message: string = err.message;
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    console.log('抛出异常', exception);
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object') {
        if (response.hasOwnProperty('message')) {
          // 处理表单错误，这类错误的message是数组形式抛出
          const msg = response['message'];
          if (Array.isArray(msg)) {
            if ((msg.length = 1)) {
              message = msg[0];
            } else if (msg.length > 1) {
              message = msg[1];
            }
          } else if (typeof msg === 'string') {
            message = msg;
          }
        }
      }
    } else {
      console.error(err);
      // 可写入日志
      message = '服务器内部错误';
    }
    const obj: IJsonResult<any> = {
      result: null,
      success: false,
      message: message,
    };
    response.status(status).json(obj);
  }
}
