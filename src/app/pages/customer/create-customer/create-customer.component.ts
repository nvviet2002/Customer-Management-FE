import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Customer } from '../../../models/requests/customer';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { CustomerService } from '../../../services/customer/customer.service';
import { ProvinceService } from '../../../services/province/province.service';
import { DistrictService } from '../../../services/district/district.service';
import { WardService } from '../../../services/ward/ward.service';
import { NgFor } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [
    NzModalModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzInputModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    NzSelectModule,
    NgFor,
    NzSpinModule,
    NzInputNumberModule,
    NzDividerModule,
  ],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css',
})
export class CreateCustomerComponent {
  customerService = inject(CustomerService);
  provinceService = inject(ProvinceService);
  districtService = inject(DistrictService);
  wardService = inject(WardService);

  isVisible: boolean = false;
  isButtonLoading: boolean = false;
  @Input() public isCreateForm: boolean = true;

  @ViewChild('districtSelect')
  districtSelect?: NzSelectComponent;
  @ViewChild('wardSelect')
  wardSelect?: NzSelectComponent;

  @Output() reloadDataEvent = new EventEmitter<any>();

  reloadCustomers() {
    this.reloadDataEvent.emit();
  }

  provinces: Array<any> = [];
  districts: Array<any> = [];
  wards: Array<any> = [];

  customerId: string = '';
  validateForm: FormGroup<{
    name: FormControl<string>;
    birthday: FormControl<Date>;
    phoneNumber: FormControl<string>;
    sex: FormControl<string>;
    address: FormControl<string>;
    provinceCode: FormControl<string>;
    districtCode: FormControl<string>;
    wardCode: FormControl<string>;
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private msg: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      birthday: [new Date(), [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      address: ['', [Validators.required]],
      provinceCode: ['', [Validators.required]],
      districtCode: ['', [Validators.required]],
      wardCode: ['', [Validators.required]],
    });

    //load data
    this.loadProvinces();
  }

  showModal(isCreateForm: boolean): void {
    this.isVisible = true;
    this.isCreateForm = isCreateForm;
    this.validateForm.reset();
  }

  setFormData(data: any): void {
    this.validateForm.reset();
    this.customerId = data.id;
    this.validateForm.controls['name'].setValue(data.name);
    this.validateForm.controls['birthday'].setValue(data.birthday);
    this.validateForm.controls['phoneNumber'].setValue(data.phoneNumber);
    this.validateForm.controls['sex'].setValue(data.sex);
    this.validateForm.controls['provinceCode'].setValue(
      data.address.provinceCode
    );
    this.loadDistricts(data.address.provinceCode);
    this.validateForm.controls['districtCode'].setValue(
      data.address.districtCode
    );
    this.loadWards(data.address.districtCode);
    this.validateForm.controls['wardCode'].setValue(data.address.wardCode);
    this.validateForm.controls['address'].setValue(data.address.address);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  submitCreateForm(): void {
    this.isButtonLoading = true;

    const customer: Customer = {
      name: this.validateForm.value.name,
      birthday: this.validateForm.value.birthday,
      sex: this.validateForm.value.sex,
      phoneNumber: this.validateForm.value.phoneNumber,
      customerAddressVM: {
        address: this.validateForm.value.address,
        provinceCode: this.validateForm.value.provinceCode,
        districtCode: this.validateForm.value.districtCode,
        wardCode: this.validateForm.value.wardCode,
      },
    };

    this.customerService.create(customer).subscribe({
      next: (data) => {
        if (data.statusCode == 200) {
          this.isButtonLoading = false;
          this.handleCancel();
          this.reloadCustomers();
          this.msg.success('Thêm mới thành công');
        }
      },
      error: (err) => {
        console.log(err.message);
        this.isButtonLoading = false;
        this.handleCancel();
        this.reloadCustomers();
        this.msg.error('Thêm mới thất bại');
      },
    });
  }

  submitUpdateForm(): void {
    this.isButtonLoading = true;

    const customer: Customer = {
      name: this.validateForm.value.name,
      birthday: this.validateForm.value.birthday,
      sex: this.validateForm.value.sex,
      phoneNumber: this.validateForm.value.phoneNumber,
      customerAddressVM: {
        address: this.validateForm.value.address,
        provinceCode: this.validateForm.value.provinceCode,
        districtCode: this.validateForm.value.districtCode,
        wardCode: this.validateForm.value.wardCode,
      },
    };

    this.customerService.update(this.customerId, customer).subscribe({
      next: (data) => {
        if (data.statusCode == 200) {
          this.isButtonLoading = false;
          this.handleCancel();
          this.reloadCustomers();
          this.msg.success('Cập nhật thành công');
        }
      },
      error: (err) => {
        console.log(err.message);
        this.isButtonLoading = false;
        this.handleCancel();
        this.reloadCustomers();
        this.msg.error('Cập nhật thất bại');
      },
    });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  loadProvinces() {
    this.provinceService.get().subscribe({
      next: (data) => {
        if (data.statusCode == 200) {
          this.provinces = data.data;
        }
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }

  loadDistricts(provinceCode?: string) {
    console.log(provinceCode);
    this.districtService.getByProvinceCode(provinceCode).subscribe({
      next: (data) => {
        if (data.statusCode == 200) {
          this.districts = data.data;
          console.log(data);
        }
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }

  loadWards(districtCode?: string) {
    this.wardService.getByDistrictCode(districtCode).subscribe({
      next: (data) => {
        if (data.statusCode == 200) {
          this.wards = data.data;
        }
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }

  onProvinceSelectChange() {
    this.validateForm.value.districtCode = '';
    this.loadDistricts(this.validateForm.value.provinceCode);
    this.validateForm.controls['districtCode'].setValue('');
    console.log(this.districtSelect);
    console.log(this.wardSelect);
  }

  onDistrictSelectChange() {
    this.validateForm.controls['wardCode'].setValue('');
    this.loadWards(this.validateForm.value.districtCode);
  }
}
