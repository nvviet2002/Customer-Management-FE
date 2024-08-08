import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppSetting } from '../../settings/app.setting';
import { ApiResponse } from '../../models/responses/api-response';

@Injectable({
  providedIn: 'root',
})
export class DistrictService {
  private http = inject(HttpClient);
  private apiUrl: string = AppSetting.APP_URL + 'api/district';

  constructor() {}

  get() {
    return this.http.get<ApiResponse<any>>(this.apiUrl);
  }

  getByProvinceCode(provinceCode?: string) {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/get-by-province-code/${provinceCode}`
    );
  }
}
