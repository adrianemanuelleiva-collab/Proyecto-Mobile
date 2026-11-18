const { createClient } = require('@supabase/supabase-js')
const path = require('path')

const resultado = require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
})

console.log('Error dotenv:', resultado.error)
console.log('Variables encontradas:', resultado.parsed ? Object.keys(resultado.parsed) : 'Ninguna')
console.log('URL SUPABASE:', process.env.SUPABASE_URL)

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

module.exports = supabase