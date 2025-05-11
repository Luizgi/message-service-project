export interface Message {
  _id: string;
  usuarioId: string;
  texto: string;
  data: Date;
  isEditing?: boolean;
  editText?: string;
}