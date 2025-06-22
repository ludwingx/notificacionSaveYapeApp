export interface Deposito {
  id: number;
  nombre: string;
  monto: number;
  moneda: string;
  origen: string | null;
  dominio: string | null;
  mensaje: string;
  canal: string;
  hash: string;
  creado_en: string;
}

export type Database = {
  public: {
    Tables: {
      depositos: {
        Row: Deposito;
        Insert: Omit<Deposito, 'id' | 'creado_en'>;
        Update: Partial<Omit<Deposito, 'id' | 'creado_en'>>;
      };
    };
  };
};
