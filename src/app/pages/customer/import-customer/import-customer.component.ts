import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CustomerService } from '../../../services/customer/customer.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-import-customer',
  standalone: true,
  imports: [
    NzModalModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzInputModule,
    ReactiveFormsModule,
    NzSpinModule,
    NzUploadModule,
  ],
  templateUrl: './import-customer.component.html',
  styleUrl: './import-customer.component.css',
})
export class ImportCustomerComponent {
  customerService = inject(CustomerService);

  isVisible: boolean = false;
  isUpLoading: boolean = false;
  fileList: NzUploadFile[] = [];

  @Output() reloadDataEvent = new EventEmitter<any>();

  constructor(private msg: NzMessageService) {}

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(): void {
    console;
    this.customerService.import(this.fileList[0]).subscribe({
      next: (data) => {
        if (data.statusCode == 200) {
          this.isUpLoading = false;
          this.fileList = [];
          this.msg.success('Import thành công');
          this.handleCancel();
        }
      },
      error: (err) => {
        console.log(err.message);
        this.isUpLoading = false;
        this.fileList = [];
        this.msg.error('Import thất bại');
        this.handleCancel();
      },
    });
  }

  reloadCustomers() {
    this.reloadDataEvent.emit();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
