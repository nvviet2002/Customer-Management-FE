import { Component, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { NzFilterTriggerComponent, NzTableModule } from 'ng-zorro-antd/table';

import { CustomerService } from '../../services/customer/customer.service';
import { PaginateRequest } from '../../models/requests/paginate-request';
import { DatePipe, NgFor } from '@angular/common';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PaginateResponse } from '../../models/responses/paginate-response';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ImportCustomerComponent } from './import-customer/import-customer.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    NzTableModule,
    NgFor,
    DatePipe,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    CreateCustomerComponent,
    NzDividerModule,
    NzSpinModule,
    NzTagModule,
    NzPaginationModule,
    NzFilterTriggerComponent,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    ImportCustomerComponent,
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {
  customerService = inject(CustomerService);
  customers: any[] = [];

  @ViewChild(CreateCustomerComponent)
  createCustomerModal?: CreateCustomerComponent;
  @ViewChild(ImportCustomerComponent)
  importCustomerModal?: ImportCustomerComponent;

  isCreateVisible: boolean = false;
  isSpinning: boolean = false;

  pageSizeOptions: number[] = [5, 10, 20, 50];

  searchSubject = new Subject<string>();

  paginateRequest: PaginateRequest = {
    pageSize: this.pageSizeOptions[0],
    pageNumber: 1,
    searchTerm: '',
  };

  paginateResponse: PaginateResponse = {
    pageCount: 0,
    pageNext: 1,
    pagePrevious: 1,
    pageSize: this.pageSizeOptions[0],
    pageNumber: 1,
    totalCount: 0,
    totalPages: 1,
    items: [],
  };

  constructor(
    private modalService: NzModalService,
    private msg: NzMessageService
  ) {
    this.loadData();
  }

  loadData() {
    this.isSpinning = true;

    this.customerService.search(this.paginateRequest).subscribe({
      next: (data) => {
        if (data.statusCode == 200) {
          this.customers = data.data.items;
          this.paginateResponse = data.data;

          console.log(this.paginateResponse);
          this.isSpinning = false;
        }
      },
      error: (err) => {
        console.log(err.message);
        this.isSpinning = false;
      },
    });
  }

  exportExcel() {
    this.isSpinning = true;

    this.customerService.export(this.paginateRequest).subscribe({
      next: (data) => {
        console.log(data);
        this.saveFileTodisk(data, 'test.xlsx');
        this.isSpinning = false;
      },
      error: (err) => {
        console.log(err);
        this.isSpinning = false;
      },
    });
  }

  importExcel() {
    this.importCustomerModal?.showModal();
  }

  saveFileTodisk(data: Blob, filename: string): void {
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', window.URL.createObjectURL(data));
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  onPageIndexChange($event: any) {
    this.paginateRequest.pageNumber = $event;
    console.log($event);
    this.loadData();
  }

  onPageSizeChange($event: any) {
    this.paginateRequest.pageSize = $event;
    console.log('page size' + $event);
    this.loadData();
  }

  onSearch() {
    this.searchSubject.pipe(debounceTime(0)).subscribe(() => {
      this.loadData();
      console.log('searchSubject');
    });
  }

  convertCustomerSex(customerSex: string) {
    switch (customerSex) {
      case 'Male': {
        return 'Nam';
      }
      case 'Female': {
        return 'Nữ';
      }
      case 'Other': {
        return 'Khác';
      }
      default: {
        return 'Không';
      }
    }
  }

  showCreateModal() {
    this.createCustomerModal?.showModal(true);
  }

  showUpdateModal(data: any) {
    console.log(data);
    this.createCustomerModal?.showModal(false);
    this.createCustomerModal?.setFormData(data);
  }

  showDeleteConfirm(data: any): void {
    this.modalService.confirm({
      nzTitle: 'Thông báo',
      nzContent: 'Bạn có chắc chắn muốn xóa khách hàng này ?',
      nzOkText: 'Có',
      nzCancelText: 'Không',
      nzOnOk: () => {
        console.log(data);
        this.customerService.delete(data.id).subscribe({
          next: (data) => {
            if (data.statusCode == 200) {
              this.loadData();
              this.msg.success('Xóa thành công');
            }
          },
          error: (err) => {
            this.loadData();
            this.msg.error('Xóa thất bại');
          },
        });
      },
    });
  }
}
