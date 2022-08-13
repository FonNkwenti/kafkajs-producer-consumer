const avro = require("avsc");

const type = avro.Type.forSchema({
  type: "record",
  fields: [
    { name: "category", type: { type: "enum", symbols: ["CAT", "DOG"] } },
    { name: "name", type: "string" },
  ],
});

export { type };
