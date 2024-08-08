import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppSetting } from '../../settings/app.setting';
import { ApiResponse } from '../../models/responses/api-response';
import { Customer } from '../../models/requests/customer';
import { PaginateResponse } from '../../models/responses/paginate-response';
import { PaginateRequest } from '../../models/requests/paginate-request';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl: string = AppSetting.APP_URL + 'api/customer';

  constructor() {}

  get() {
    return this.http.get<ApiResponse<any>>(this.apiUrl);
  }

  getSingle(id: string) {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  //error
  search(paginateRequest: PaginateRequest) {
    return this.http.post<ApiResponse<PaginateResponse>>(
      `${this.apiUrl}/search`,
      paginateRequest
    );
  }

  create(data: Customer) {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}`, data);
  }

  update(id: string, data: Customer) {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  export(paginateRequest: PaginateRequest) {
    return this.http.post(`${this.apiUrl}/export`, paginateRequest, {
      responseType: 'blob',
    });
  }

  import(file: any) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/import`, formData);
  }
}
