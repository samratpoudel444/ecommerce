const passwordRegex= /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
const userNameRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\[a-zA-Z]{2,}$/

module.exports={passwordRegex, userNameRegex};