import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { DataService } from '../services/data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SEARCH_VALUE_HEADER } from '../../core/const';

@Injectable()
export class SearchValueInterceptor implements HttpInterceptor {
  searchValue: string | null = null;
  constructor(private dataService: DataService) {
    this.dataService.currentSearchValue.subscribe((data) => {
      this.searchValue = data;
    });
  }
  intercept(
    req: HttpRequest<any>,
    handler: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.searchValue) {
      const requestWithSearchValue = req.clone({
        headers: req.headers.append(
          SEARCH_VALUE_HEADER,
          encodeURI(this.searchValue)
        ),
      });
      return handler.handle(requestWithSearchValue);
    }
    return handler.handle(req);
  }
}
