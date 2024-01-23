const request = require('request')

const geocode = (address, callback) => {
    const url = 'http://api.positionstack.com/v1/forward?access_key=5afa5a130a9f26e20a1e68feac626be5&query=' + encodeURIComponent(address) + '&limit=1'

    request({url, json:true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to location service!', undefined)
        } else if (body.error) {
            callback('Unable to find location. Try another search', undefined)
        } else {
            callback(undefined, {
            place_name: body.data[0].name,
            region: body.data[0].region,
            country: body.data[0].country,
            latitude: body.data[0].latitude,
            longitude: body.data[0].longitude
            })
        }
    })

}

module.exports = geocode