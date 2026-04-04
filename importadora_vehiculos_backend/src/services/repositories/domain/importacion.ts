export interface Importacion {
    id_importacion?: number;
    id_ingreso:number;
    pais_origen: string;
    costo_dolares: number;
    tipo_cambio:number;
    estado?: 'ACTIVO'|'ANULADO';
}