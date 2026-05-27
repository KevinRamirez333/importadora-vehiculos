process.env.NODE_ENV = process.env.NODE_ENV || 'configuration';
process.env.APP_ENV = process.env.APP_ENV || 'configuration';

import dotenv = require('dotenv');
import cors from "cors";
dotenv.config({
    path: `${__dirname}/../config/${process.env.APP_ENV}.env`
});

import express = require('express');
import {loadControllers} from 'awilix-express'
import loadContainer from './container';
const app = express();
app.use(cors());
app.use(express.json());
loadContainer(app); 

// Detectamos si el código se está ejecutando desde la carpeta 'dist'
const isCompiled = __dirname.includes('dist');
const extension = isCompiled ? 'js' : 'ts';

app.use(loadControllers(
    `controllers/*.${extension}`,
    {cwd: __dirname}
));
export{app}