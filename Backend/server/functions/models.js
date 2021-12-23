/**
 * Returns array with all layers and added images from groups
 * @param {Array} layer Contains all layers with ids and order
 * @param {Object} group Contains one group with images and associated layers
 * @returns {Array} Array with layers
 */
function createLayersFromGroup(layer, group) {
  layer = layer.map((layer) => {
    return { _id: layer._id, name: layer.name, order: layer.order, images: [] };
  });
  let layerRef = layer.reduce((layerMap, layer) => {
    layerMap.set(layer._id.toString(), layer);
    return layerMap;
  }, new Map());

  group.images.reduce((layerMap, image) => {
    if (layerMap.has(image.layer._id.toString())) {
      layerMap.get(image.layer._id.toString()).images.push(image);
    }
    return layerMap;
  }, layerRef);

  layer = layer.filter((layer) => {
    return layer.images.length > 0 ? true : false;
  });

  return layer;
}

module.exports = {
  createLayersFromGroup,
};
