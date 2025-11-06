export interface BaseEntityDto {
  id: string;
  created_at?: Date;
}

export interface NamedEntityDto extends BaseEntityDto {
  name: string;
}
