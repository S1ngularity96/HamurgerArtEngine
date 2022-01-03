const { connect } = require("../db");
const { GeneratedImage } = require("../../models/dbmodels");

process.on("exit", async () => {
  console.log("Disconnecting from database ... ");
  await mongoose.disconnect();
});

async function getMetadataById(id) {
  let image = await GeneratedImage.findById(id).populate({
    path: "images",
    select: "name",
    populate: { path: "layer", select: "name" },
  });

  let metadata = {
    image: `https://tokenURI/${image.order}.png`,
    tokenId: image.order,
    description:
      "After Party Ape Club is a collection of 8,420 apes that made it to the after party",
    name: `#${image.order}`,
    attributes: image.images.map((attribute) => {
      return {
        trait_type: attribute.layer.name,
        value: attribute.name.replace(".jpg", "").replace(".png", ""),
      };
    }),
  };

  console.log(metadata);
}

connect({ host: "127.0.0.1" })
  .then(async () => {
    let id = "61d259d8d572000fe1bcc7bc";
    await getMetadataById(id);
    process.exit();
  })
  .catch((err) => {
    console.log(err);
  });
