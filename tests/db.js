var assert = require("assert");
const { db, Image, ImageAttribute, Layer, ExclusionGroup } = require("../models/dbmodels");
const { app } = require("../server/server");

const chai = require("chai");
const chaiHttp = require("chai-http");
const { Op } = require("sequelize");
//configure chai
let should = chai.should();
chai.use(chaiHttp);

describe("Database", function () {
  before(async () => {
    await db.sync();
  });

  afterEach(async () => {
    await db.dropAllSchemas();
    await db.sync();
  });

  it("Insert and Get Layers", async () => {
    let layer = await Layer.create({ name: "Bottom" });
    await Image.create({
      name: "Blue",
      filepath: "/opt/Blue.png",
      hash: "xyz23ef",
      layerId: layer.id,
    });
  });

  it("Should create exclusion Group", async () => {
    let layer = await Layer.create({ name: "Bottom" });
    let img1 = await Image.create({
      name: "Blue",
      filepath: "/opt/Blue.png",
      hash: "xyz23ef",
      layerId: layer.id,
    });
    let img2 = await Image.create({
      name: "Red",
      filepath: "/opt/Red.png",
      hash: "xyz24fg",
      layerId: layer.id,
    });

    let exGroup;
    if (img1.id < img2.id)
      exGroup = await ExclusionGroup.create({ imgsourceId: img1.id, imgdestId: img2.id });
    else exGroup = await ExclusionGroup.create({ imgsourceId: img2.id, imgdestId: img1.id });

    let groups = await ExclusionGroup.findAll()
    console.log(groups);
  });
});

describe("Test HTTP", function () {
  before(async () => {
    await db.sync();
  });

  this.afterEach(async () => {
    await Image.drop();
    await ImageAttribute.drop();
    await Layer.drop();
  });

  it("Should load Index with layers", (done) => {
    chai
      .request(app)
      .get("/api/layers/reload")
      .then((res) => {
        res.should.have.status(200);
        should.equal(res.body.message, "Fileindex reloaded successfully");
        chai
          .request(app)
          .get("/api/layers")
          .then((res) => {
            res.should.have.status(200);
            should.equal(8, res.body.data.length, 8);
            done();
          })
          .catch((err) => {
            should.fail("Should not throw error");
          });
      })
      .catch((err) => {
        should.fail("Should not throw error");
        done();
      });
  });
});
