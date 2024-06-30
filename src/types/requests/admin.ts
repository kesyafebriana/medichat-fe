export interface AddProductRequest {
  name: string,
  generic_name: string,
  description: string,
  content: string,
  composition: string,
  category_id: number,
  product_classification: string,
  manufacturer: string,
  product_form: string,
  unit_in_pack: string,
  selling_unit: string,
  picture?: File,
  weight: number,
  width: number,
  height: number,
  length: number,
}

export interface AddCategoryRequestLevel1 {
  id?: number;
  name: string;
  image: File;
}

export interface AddCategoryRequest {
  id?: number;
  name: string;
}

