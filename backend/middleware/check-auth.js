const jwt = require("jsonwebtoken");

SECRET_KEY =
  "MIICXAIBAAKBgQCVBj1ltpZm76I7Uj2CwRmxqmu6NhLmko1JSCFRHKlsWryphrqXkQrDw5f5lH6NPrDphJneflSmtoS3s6Kaqz3e5GpRiwTMFdDC+ndnNJ9SqyIonUJ8mWF0bbz2dmnMk3cKqtShE0h82WuN7mGBvwFYVqQNEY6ESDrXsITkhbZBnQIDAQABAoGAK4I83rtmQftoxCUIrGowVDzLYvxynDrhYSncAFB77pS3TE93ntTL7cfnUQjXwekxwZvjSKBdmqbjLLcXnEyurTcun25IKxIYMEHFJSCyZ77ntRXKUYqknqMl01rCBLNmSu8BGMHUoxFFqpFSQbINfeCm5AMs4wWm+iZrO8UZIECQQDmM07EWLzdGehD0gNf61ByI9NaC28B8Spsg1YV9KzBaPywXVKX7jfDAbmWN0Nh3mQsUxYMzWj9fHqA4xm4QHRAkEApbnn7M789ffh6ZLjCunpEek2gQByXCTKfXKkorCke7y1BfCr5eKZ55ThItxuSnac9US6Ew4xDTrZbYcKDQJAaaK90IhQEr4iwaFR9ST184rRIA8DH8cFisoyJN0ksZR18JDCqAme+ROkFlHyI9NHkLHfOaBRJOv7+3tIQJAcjvA5SNXodXZvNzo7z7oztXIIgeizGz3vpzlqicPkvP4IcX3Bn4YgvAZdYWA8DcvQywH89G6FuokXsV0Z3hiQJBAOGnStfI2jpDmELFH2wj+tU5ka8CGHO2Ns0UOefCWiPGseJQDtc3RlsRrqkTLwaJqK9MgIwMoKxDLV+utsF52DU=";

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY);
    next();
  } catch (error) {
    res.status(401).json({
      message: "User authentication failed!"
    });
  }
};
