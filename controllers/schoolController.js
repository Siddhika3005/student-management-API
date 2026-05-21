const pool = require('../db')

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

const parseCoordinate = (value) => {
  if (value === undefined || value === null || value === '') return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

const validateSchoolPayload = ({ name, address, latitude, longitude }) => {
  if (!isNonEmptyString(name)) {
    return 'Name is required'
  }
  if (!isNonEmptyString(address)) {
    return 'Address is required'
  }

  const lat = parseCoordinate(latitude)
  const lon = parseCoordinate(longitude)

  if (lat === null || lon === null) {
    return 'Latitude and longitude must be valid numbers'
  }
  if (lat < -90 || lat > 90) {
    return 'Latitude must be between -90 and 90'
  }
  if (lon < -180 || lon > 180) {
    return 'Longitude must be between -180 and 180'
  }

  return null
}

const toRadians = (value) => (value * Math.PI) / 180

const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

const addSchool = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude } = req.body
    const validationError = validateSchoolPayload({ name, address, latitude, longitude })

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError })
    }

    const lat = Number(latitude)
    const lon = Number(longitude)

    const query =
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)'
    const [result] = await pool.execute(query, [name.trim(), address.trim(), lat, lon])

    return res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name: name.trim(),
        address: address.trim(),
        latitude: lat,
        longitude: lon,
      },
    })
  } catch (error) {
    return next(error)
  }
}

const listSchools = async (req, res, next) => {
  try {
    const userLat = parseCoordinate(req.query.latitude)
    const userLon = parseCoordinate(req.query.longitude)

    if (userLat === null || userLon === null) {
      return res.status(400).json({
        success: false,
        message: 'Query params latitude and longitude are required and must be numbers',
      })
    }

    const [rows] = await pool.execute('SELECT * FROM schools')

    const withDistance = rows.map((school) => {
      const distance = haversineDistanceKm(userLat, userLon, school.latitude, school.longitude)
      return { ...school, distance_km: Number(distance.toFixed(3)) }
    })

    withDistance.sort((a, b) => a.distance_km - b.distance_km)

    res.status(200).json({ success: true, data: withDistance })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  addSchool,
  listSchools,
}
