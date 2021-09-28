const JSONFiles = [
  "e62f8d18-412f-4d86-8a19-99b6c3381741.json", // valid   -> resultado correcto
  "2d77b0c6-858f-407f-a518-58371ac9adcb.json", // invalid -> resultado correcto
  "4a71a08a-b31e-427e-84f3-127a1273ffd2.json", // valid   -> resultado correcto
  "6e3beecd-9bbf-4ec1-8960-f15c73c87d99.json", // valid   -> resultado correcto
  "22ca4ccf-8d14-4035-9cbb-c1d0aee5ef38.json", // invalid -> resultado correcto
  "b7af2583-451c-41cc-9377-87296e1bf4a4.json", // valid   -> resultado correcto
  "d598e54f-923f-4397-8914-149ee41a7f61.json", // invalid -> resultado correcto
  "e693b52e-c274-43a8-b38a-9675c8b2ac04.json", // valid   -> resultado correcto
  "efc30e08-49b1-4d1e-a727-a35aecd6468e.json", // invalid -> resultado correcto
  "de36e998-e116-4d3e-8742-6000b29c2925.json", // valid   -> resultado incorrecto, disagree con data, url vacia pero publicado
  "0379c574-3c1d-4c76-b694-589290f709a7.json", // valid*/ -> resultado correcto
];

module.exports = Object.freeze(JSONFiles);
