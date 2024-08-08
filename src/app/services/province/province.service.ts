import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppSetting } from '../../settings/app.setting';
import { ApiResponse } from '../../models/responses/api-response';

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  private http = inject(HttpClient);
  private apiUrl: string = AppSetting.APP_URL + 'api/province';

  constructor() {}

  get() {
    return this.http.get<ApiResponse<any>>(this.apiUrl);
  }
}
