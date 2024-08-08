export interface Customer {
  name?: string;
  birthday?: Date;
  phoneNumber?: string;
  sex?: string;
  customerAddressVM?: CustomerAddress;
}

export interface CustomerAddress {
  address?: string;
  provinceCode?: string;
  districtCode?: string;
  wardCode?: string;
}
