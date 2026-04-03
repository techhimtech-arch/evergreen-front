import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http = inject(HttpClient);

  /**
   * Generic GET method
   * @param url API Endpoint URL
   * @param params Optional Query Parameters object
   */
  get<T>(url: string, params?: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> }): Observable<T> {
    return this.http.get<T>(url, { params });
  }

  /**
   * Generic POST method
   * @param url API Endpoint URL
   * @param body Payload body
   */
  post<T>(url: string, body: any | null, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.post<T>(url, body, options);
  }

  /**
   * Generic PUT method
   * @param url API Endpoint URL
   * @param body Payload body
   */
  put<T>(url: string, body: any | null, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.put<T>(url, body, options);
  }

  /**
   * Generic PATCH method
   * @param url API Endpoint URL
   * @param body Payload body
   */
  patch<T>(url: string, body: any | null, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.patch<T>(url, body, options);
  }

  /**
   * Generic DELETE method
   * @param url API Endpoint URL
   * @param params Optional Query Parameters object
   */
  delete<T>(url: string, params?: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> }): Observable<T> {
    return this.http.delete<T>(url, { params });
  }
}
