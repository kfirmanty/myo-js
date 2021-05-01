//all myo values expected to be from 0 to 1
const UP_DIRECTION = "up";
const DOWN_DIRECTION = "down";
const BOTH_DIRECTION = "both";
const DEBOUNCE_RANGE = 0.1;

const constantly = val => value => val;

const toRangeConverter = (from, to) => value => from + (to - from) * value;

const triggerOnThresholdPass = (threshold, direction, debounceRange) => {
    let prevValue = 0;
    let canTrigger = true;
    const debounce = debounceRange || DEBOUNCE_RANGE;
    return value => {
        let trigger = false;
        if (
            (value > threshold &&
                prevValue <= threshold &&
                (direction == UP_DIRECTION || direction == BOTH_DIRECTION)) ||
            (value < threshold &&
                prevValue >= threshold &&
                (direction == DOWN_DIRECTION || direction == BOTH_DIRECTION))
        ) {
            if (canTrigger) {
                canTrigger = false;
                trigger = true;
            } else {
                trigger = false;
            }
        } else {
            trigger = false;
        }
        prevValue = value;
        if (Math.abs(value - threshold) > debounce) {
            canTrigger = true;
        }
        return trigger;
    };
};

const triggerConstantly = constantly(true);

const orientationPitch = values => values.orientation.pitch;
const orientationRoll = values => values.orientation.roll;
const orientationYaw = values => values.orientation.yaw;
const gyroX = values => values.gyro.x;
const gyroY = values => values.gyro.y;
const gyroZ = values => values.gyro.z;
const accelX = values => values.accel.x;
const accelY = values => values.accel.y;
const accelZ = values => values.accel.z;

const onParameter = (fn, parameterSelector) => values => {
    const value = parameterSelector ? parameterSelector(values) : null;
    return fn(value);
};

const listener = ({ valueGenerators, triggerFn, onTrigger }) => values => {
    const calculatedValues = valueGenerators.map(f => f(values));
    const trigger = triggerFn(values);
    if (trigger) onTrigger(calculatedValues);
};

const processValues = (listeners, values) =>
    listeners
        .map(listener => listener(values))
        .filter(v => v != null)
        .flat();
