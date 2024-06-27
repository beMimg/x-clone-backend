const crypto = require("crypto");

exports.randomColor = () => {
  const colors = [
    "rose",
    "red",
    "green",
    "blue",
    "teal",
    "yellow",
    "orange",
    "purple",
  ];

  const randomNumber = Math.floor(Math.random() * colors.length);

  return colors[randomNumber];
};

exports.getRandomName = () => {
  const randomNames = [
    "John",
    "Everest",
    "Elon",
    "Elen",
    "Fred",
    "Jihn",
    "Flor",
    "Beauty",
  ];

  const randomNumber = Math.floor(Math.random() * randomNames.length);

  return randomNames[randomNumber];
};

exports.getRandomUsername = (first_name) => {
  const randomString = crypto.randomBytes(8).toString("hex");

  const username = `${first_name}${randomString}`;
  return username;
};
