# Front

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

1. Componentes del Sistema Principal

# LoginComponent
Visual: Es la pantalla inicial de la aplicación
Función: Formulario de acceso con campos para usuario y contraseña

# DashboardComponent
Visual: Panel principal después del login
Función: Menú con tarjetas para acceder a las secciones principales (Productos, Ventas, Compras)
Acceso: Todos los usuarios ven Productos y Ventas, solo los administradores ven Compras

2. Gestión de Productos

# ProductosMenuComponent
Visual: Menú específico de la sección de productos
Función: Muestra opciones para Listar Productos y Crear Productos (este último solo para administradores)

# ProductosListaComponent
Visual: Cuadrícula de tarjetas con todos los productos
Función: Permite ver el inventario, filtrar por nombre/familia, y realizar acciones como editar/desactivar productos (admin)
Reutilización: Este mismo componente se utiliza en el contexto de ventas, donde muestra además opciones para agregar al carrito

# ProductoDetalleComponent
Visual: Vista detallada de un producto específico
Función: Muestra toda la información de un producto: imagen, nombre, código, precio, stock, etc.

# ProductoCrearComponent
Visual: Formulario para dar de alta un nuevo producto
Función: Permite a administradores agregar productos con todos sus datos

# ProductoEditarComponent
Visual: Formulario similar al de creación pero precargado con datos existentes
Función: Permite modificar la información de un producto existente

3. Gestión de Ventas

# VentasMenuComponent
Visual: Menú específico de la sección de ventas
Función: Muestra opciones para Realizar Venta e Historial de Ventas

# ProductosListaComponent (en contexto de ventas)
Visual: Cuadrícula de productos similar a la vista normal, pero con controles de cantidad y botón "Agregar al carrito"
Función: Permite seleccionar productos para vender
Diferencias: Incluye un botón flotante del carrito con contador de productos

# CarritoComponent
Visual: Tabla de artículos seleccionados para la venta
Función: Permite ajustar cantidades, eliminar productos y finalizar la venta

# VentasHistorialComponent
Visual: Lista de tarjetas con todas las ventas realizadas
Función: Muestra detalles de cada venta (productos, cantidades, precios), permite filtrar por fechas

4. Gestión de Compras (solo administradores)

# ComprasMenuComponent
Visual: Menú específico de la sección de compras
Función: Muestra opciones para Realizar Compra e Historial de Compras

# ComprasProductosComponent
Visual: Cuadrícula de productos similar a la de ventas
Función: Permite seleccionar productos para comprar
Diferencias: Incluye un campo para establecer el precio de compra (que puede ser distinto al de venta)

# CarritoCompraComponent
Visual: Tabla de artículos seleccionados para la compra
Función: Permite ajustar cantidades, precios unitarios, eliminar productos y finalizar la compra

# CompraCrearComponent
Visual: Interfaz alternativa para realizar compras, dividida en dos secciones
Función: Lista de productos a la izquierda, detalles de la compra a la derecha

# ComprasHistorialComponent
Visual: Lista de tarjetas con todas las compras realizadas
Función: Muestra detalles de cada compra (productos, cantidades, precios unitarios), permite filtrar por fechas

# Flujos de navegación principales:

1 Flujo de venta: Dashboard → Ventas → Seleccionar productos → Carrito → Finalizar venta
2 Flujo de compra: Dashboard → Compras → Seleccionar productos → Carrito de compra → 3 3 3 Finalizar compra

#Gestión de inventario: Dashboard → Productos → Listar/Crear/Editar/Ver detalles
Cada componente está diseñado con un estilo coherente, utilizando tarjetas, tablas y formularios con un diseño responsive que se adapta a diferentes tamaños de pantalla.
