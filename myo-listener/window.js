const window = () => {
    const windowArr = () => [0, 0, 0, 0];
    const windowToValue = window => {
        const val = window.reduce((acc, el) => acc + el) / window.length;
        return Math.round(val * 100) / 100;
    };
    const threeParams = () => [windowArr(), windowArr(), windowArr()];
    let data = {
        orientation: threeParams(),
        emg: threeParams(),
        accel: threeParams(),
        gyro: threeParams()
    };

    const addValues = (type, values) => {
        const typeData = data[type];
        for (let i = 0; i < typeData.length; i++) {
            const window = typeData[i];
            const length = window.length;
            window.unshift(values[i]);
            window.length = length;
        }
    };

    const getValues = () =>
        Object.fromEntries(
            Object.keys(data).map(k => [k, data[k].map(windowToValue)])
        );

    return { addValues, getValues };
};

exports.window = window;
