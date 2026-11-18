
const supabase = require('../config/database')
const bcrypt = require('bcryptjs')

// REGISTRAR USUARIO
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body

        if (!nombre || !email || !password) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener al menos 6 caracteres'
            })
        }

        const contraseñaHash = await bcrypt.hash(password, 10)

        const { data, error } = await supabase.from('Usuarios').insert([{Nombre: nombre,Mail: email,Contraseña: contraseñaHash}]).select('id, Nombre, Mail').single()

        if (error) {
            if (error.code === '23505') { return res.status(409).json({mensaje: 'El email ya está registrado'})
            }

            throw error
        }

        res.status(201).json({mensaje: 'Usuario registrado correctamente', usuario: data})

    } catch (error) {
        console.log(error)
        res.status(500).json({mensaje: 'Error al registrar usuario'
        })
    }
}

exports.login = async (req, res) => {
    try {const { email, password } = req.body

        if (!email || !password) {return res.status(400).json({mensaje: 'Ingresá email y contraseña'}) }

        const { data: usuario, error } = await supabase.from('Usuarios').select('*').eq('Mail', email).maybeSingle()

        if (error) {
            throw error
        }

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' })
        }

        const passwordValida = await bcrypt.compare(password, usuario['Contraseña'])

        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Email o contraseña incorrectos'})
        }

        res.json({ mensaje: 'Inicio de sesión correcto',usuario: {id: usuario.id,nombre: usuario.Nombre,email: usuario.Mail}
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error al iniciar sesión'})
    }
}


exports.obtenerJuegos = async (req, res) => {
    try {
        const { usuarioId } = req.query

        if (!usuarioId) {
            return res.status(400).json({mensaje: 'Falta el ID del usuario' })
        }

        const { data, error } = await supabase.from('Juegos') .select('*') .eq('id_Usuario', usuarioId)

        if (error) {
            throw error
        }

        res.json(data)

    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error al obtener juegos' })
    }
}

exports.agregarJuego = async (req, res) => {
    try {
        const { nombre, plataforma, genero, estado, id_usuario } = req.body

        if (!nombre || !plataforma || !genero || !estado || !id_usuario) {
            return res.status(400).json({mensaje: 'Todos los campos son obligatorios' })
        }

        const { data, error } = await supabase.from('Juegos') .insert([{Nombre: nombre,Plataforma: plataforma, Genero: genero,Estado: estado,id_Usuario: id_usuario}]).select().single()

        if (error) {
            throw error
        }

        res.status(201).json({ mensaje: 'Juego agregado correctamente',juego: data})

    } catch (error) {
        console.log(error)
        res.status(500).json({mensaje: 'Error al agregar juego' })
    }
}

exports.editarJuego = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, plataforma, genero, estado, id_usuario } = req.body

        if (!nombre || !plataforma || !genero || !estado || !id_usuario) {
            return res.status(400).json({mensaje: 'Todos los campos son obligatorios' })
        }

        const { data, error } = await supabase .from('Juegos').update({ Nombre: nombre,Plataforma: plataforma, Genero: genero,Estado: estado }).eq('id', id) .eq('id_Usuario', id_usuario).select().maybeSingle()

        if (error) {
            throw error
        }

        if (!data) {
            return res.status(404).json({
                mensaje: 'Juego no encontrado'
            })
        }

        res.json({
            mensaje: 'Juego modificado correctamente',
            juego: data
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: 'Error al editar juego'
        })
    }
}

exports.eliminarJuego = async (req, res) => {
    try {
        const { id } = req.params
        const { usuarioId } = req.query

        if (!usuarioId) {
            return res.status(400).json({
                mensaje: 'Falta el ID del usuario'
            })
        }

        const { data, error } = await supabase.from('Juegos').delete().eq('id', id).eq('id_Usuario', usuarioId).select().maybeSingle()

        if (error) {
            throw error
        }

        if (!data) {
            return res.status(404).json({
                mensaje: 'Juego no encontrado'
            })
        }

        res.json({
            mensaje: 'Juego eliminado correctamente'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: 'Error al eliminar juego'
        })
    }
}
