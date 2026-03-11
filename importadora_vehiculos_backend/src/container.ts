//Inyeccion de dependencias con Awilix
import { createContainer } from "awilix"
import { scopePerRequest } from "awilix-express"
import express = require('express');
import { asClass } from "awilix";


export default (app: express.Application) => {
    const container = createContainer({
        injectionMode: 'CLASSIC'
    })

    app.use(scopePerRequest(container));
}
