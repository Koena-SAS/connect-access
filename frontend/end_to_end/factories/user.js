var Factory = require("rosie").Factory;
var faker = require("faker");

module.exports = new Factory()
  .attr("first_name", () => faker.name.firstName())
  .attr("last_name", () => faker.name.lastName())
  .attr("email", () => faker.internet.email())
  .attr("phone_number", () => faker.phone.phoneNumber("##########"))
  .attr("password", () => "strongestpasswordever")
  .attr("re_password", () => "strongestpasswordever");
