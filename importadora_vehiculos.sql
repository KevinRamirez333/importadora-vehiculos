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
  constraint pk_id_ingreso primary key (id_ingreso),
  constraint fk_vin_vehiculo foreign key (vin) references vehiculo(vin)
 -- constraint fk_id_cliente_ingreso foreign key (id_cliente) references cliente(id_cliente)
);





