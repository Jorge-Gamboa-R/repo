Laboratorio # 2 – Despliegue de una Aplicación con Docker

Información General

Universidad Catolica de Pereira
Programa: Tecnología en Desarrollo de Software
Asignatura: Despliegue de Aplicaciones  

Objetivo del Laboratorio # 2

Desarrollar y desplegar una API REST utilizando Node.js y MongoDB, aplicando buenas prácticas de contenerización con Docker y orquestación con Docker Compose.

Arquitectura del Sistema

El sistema está compuesto por los siguientes servicios:

-Backend (Node.js + Express)
-MongoDB (Base de datos)
-Redis (Simulación de caché)
-olumen Docker para persistencia
-Red interna Docker

Diagrama de Arquitectura

imagen generada por Draw.io [](diagrama.png) 

El sistema funciona dentro de una red Docker personalizada donde:

-El backend se comunica con Mongo usando el nombre del servicio `mongo`
-Mongo almacena datos en un volumen persistente
-Redis simula una capa de caché
-El puerto 3000 está expuesto al host

Flujo de Red

1.Cliente (Postman) → `localhost:3000`
2.Docker redirige al contenedor backend
3.Backend se comunica internamente con:
   -mongo:27017
   -redis:6379

Persistencia de Datos

Se utiliza un volumen Docker:

yaml
volumes
mongo_data

Problemas encontrados

-Conexión Mongo con localhost dentro de Docker
-Manejo de errores en endpoints

Mejoras implementadas

-Healthcheck
-Redis como servicio adicional

Mejoras futuras

-Implementar cache con Redis
- istema de autenticación
-Balanceador de carga