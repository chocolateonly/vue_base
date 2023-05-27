module.exports = ({ file }) => {
    let remUnit = 100
    if (file && file.dirname && file.dirname.indexOf("vant")>-1) {
        remUnit = 37.5
    }
    return {
        plugins: {
            'postcss-pxtorem': {
                rootValue: remUnit,
                propList: ['*']
            },
            'autoprefixer': {}
        }
    }
}
