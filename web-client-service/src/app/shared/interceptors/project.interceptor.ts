import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { DataService } from '../services/data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PROJECT_HEADER } from '../../core/const';

@Injectable()
export class ProjectInterceptor implements HttpInterceptor {
  currentProjectId: string | null = null;
  constructor(private dataService: DataService) {
    this.dataService.currentProject.subscribe((data) => {
      this.currentProjectId = data;
    });
  }
  intercept(
    req: HttpRequest<any>,
    handler: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('this.currentProjectId URL: ' + this.currentProjectId);
    console.log('Request URL: ' + req.url);
    if (this.currentProjectId) {
      const requestWithPorject = req.clone({
        headers: req.headers.append(PROJECT_HEADER, this.currentProjectId),
      });
      return handler.handle(requestWithPorject);
    }
    return handler.handle(req);
  }
}
