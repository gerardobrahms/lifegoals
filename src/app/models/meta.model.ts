export class Meta {
  id?: string;
  meta: string;

  constructor(meta: string = '', id?: string) {
    this.meta = meta;
    this.id = id;
  }
}
