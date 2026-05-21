const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const schoolRoutes = require('./routes/schoolRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok' })
})

app.use('/', schoolRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Server error',
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
