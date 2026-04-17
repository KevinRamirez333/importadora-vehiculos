create database importadora;
use importadora;

create table rol(
id_rol int auto_increment,
nombre varchar(20),
activo boolean default true,
constraint pk_id_rol primary key(id_rol)
);

CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  activo boolean default true,
  id_rol int,
  constraint fk_id_rol foreign key (id_rol)references rol(id_rol)
);


create table estado(
id_estado int auto_increment,
nombre varchar(20) not null ,
activo boolean default true,
constraint pk_id_estado primary key (id_estado)
);

create table marca(
id_marca int auto_increment,
nombre varchar(20) not null,
activo boolean default true,
constraint pk_id_marca primary key(id_marca)
);

create table modelo(
id_modelo int auto_increment,
nombre varchar(50) not null,
activo boolean default true,
id_marca int,
constraint pk_id_modelo primary key(id_modelo),
constraint fk_id_marca_modelo foreign key(id_marca) references marca(id_marca)
);

create table vehiculo(
vin varchar(20),
modelo int,
placa varchar(20),
anio int,
color varchar(20),
precio_venta decimal(12,2),
porcent_ganancia int,
activo boolean default true,
id_marca int,
id_estado int,
id_modelo int,
constraint pk_vin primary key (vin),
constraint fk_id_marca foreign key (id_marca) references marca(id_marca),
constraint fk_id_estado foreign key (id_estado) references estado(id_estado),
constraint fk_id_modelo foreign key(id_modelo) references modelo(id_modelo)
);

create table ingreso_vehiculo(
  id_ingreso int auto_increment,
  vin varchar(20),
  tipo_ingreso enum('IMPORTACION','COMPRA_LOCAL','RECIBIDO_COMO_PAGO'),
  fecha date,
  id_cliente int null,
  valor_ingreso decimal(12,2),
  estado_ingreso ENUM('ACTIVO','ANULADO') DEFAULT 'ACTIVO',
  constraint pk_id_ingreso primary key (id_ingreso),
  constraint fk_vin_vehiculo foreign key (vin) references vehiculo(vin),
  constraint fk_id_cliente_ingreso foreign key (id_cliente) references cliente(id_cliente)
);
alter table ingreso_vehiculo
add column estado_ingreso ENUM('ACTIVO','ANULADO') DEFAULT 'ACTIVO';


create table cliente(
  id_cliente int auto_increment,
  nombre varchar(100),
  apellido varchar(100),
  nit varchar(20) unique,
  dpi varchar(20) unique,
  telefono varchar(20),
  direccion varchar(30),
  estado boolean default true,
constraint pk_id_cliente primary key (id_cliente)
);

create table importacion(
id_importacion int auto_increment,
id_ingreso int,
costo_dolares decimal(12,2),
tipo_cambio decimal(12,2),
pais_origen varchar(20),
estado ENUM('ACTIVO','ANULADO') DEFAULT 'ACTIVO',
constraint pk_id_importacion primary key(id_importacion),
constraint fk_id_ingreso foreign key (id_ingreso) references ingreso_vehiculo(id_ingreso)
);

create table vehiculo_costo(
id_costo int auto_increment,
vin varchar(20),
tipo_costo enum('TRASPASO','TALLER','IMPUESTO','PLACAS','TRAMITES','OTRO'),
descripcion varchar(100),
monto decimal(12,2),
fecha date,
estado enum('ACTIVO','ANULADO'),
constraint pk_id_costo primary key(id_costo),
constraint fk_vin_costo foreign key (vin) references vehiculo(vin)
);




