import mongoose from 'mongoose';
import { Schema,model } from 'mongoose'
import { randomUUID } from "node:crypto"
import { hashear, hasheadasSonIguales } from "../utils/cripto.js"

const collection = 'usuarios'
const userSchema = new Schema({
    _id: { type: String, default: randomUUID },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    role: { type: String, default: 'usuario' },
},{
  strict: 'throw',
  versionKey: false,
  methods: {
    infoPublica: function () {
      return {
        email: this.email,
        first_name: this.first_name,
        last_name: this.last_name,
      }
    }
  },
  statics: {
    registrar: async function (reqBody) {
      reqBody.password = hashear(reqBody.password)
      const creado = await mongoose.model(collection).create(reqBody)

      const datosUsuario = {
        email: creado.email,
        first_name: creado.first_name,
        last_name: creado.last_name,
        role: 'usuario'
      }

      return datosUsuario
    },
    autenticar: async function (username, password) {

      let datosUsuario

      if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        datosUsuario = {
          email: 'admin',
          first_name: 'admin',
          last_name: 'admin',
          role: 'admin'
        }
      } else {
        const usuario = await mongoose.model(collection).findOne({ email: username }).lean()

        if (!usuario) {
          throw new Error('usuario no encontrado')
        }
        console.log("hashe: ",usuario.password);
        console.log("input: ",password);

        if (!hasheadasSonIguales(password, usuario.password)) {
          throw new Error('los datos no coinciden')
        }

        datosUsuario = {
          email: usuario.email,
          first_name: usuario.first_name,
          last_name: usuario.last_name,
          role: 'usuario'
        }
      }

      if (!datosUsuario) {
        throw new Error('usuario no encontrado')
      }

      return datosUsuario
    },
    resetearContrasenia: async function (email, password) {
      const newPassword = hashear(password)

      const actualizado = await mongoose.model(collection).findOneAndUpdate(
        { email },
        { $set: { password: newPassword } },
        { new: true }
      ).lean()

      if (!actualizado) {
        throw new Error('usuario no encontrado')
      }

      return actualizado
    }
  }
})

export const UsersManager = model('usuarios', userSchema)