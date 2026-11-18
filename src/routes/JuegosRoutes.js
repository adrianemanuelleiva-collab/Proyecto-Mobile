const express = require('express')
const router = express.Router()

const {registrarUsuario, login, obtenerJuegos, agregarJuego, editarJuego, eliminarJuego} = require('../controllers/JuegosController')

router.post('/usuarios/registro', registrarUsuario)
router.post('/login', login)

router.get('/juegos', obtenerJuegos)
router.post('/juegos', agregarJuego)
router.put('/juegos/:id', editarJuego)
router.delete('/juegos/:id', eliminarJuego)

module.exports = router