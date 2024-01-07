import { Router } from 'express'
import { ProdMan } from "../App.js"
export const homeRouter = Router()


homeRouter.get('/home', (req, res) => {
  const user = req.session && req.session.user; 
  if (user) {
    const mensajeBienvenida = `Bienvenido, ${user.first_name} ${user.last_name} (${user.email})`;
    res.render('main', { titulo: 'Productos', mensajeBienvenida });
  } else {
    res.redirect('/login'); 
  }
});


homeRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { titulo: 'Productos En Tiempo Real' })
})