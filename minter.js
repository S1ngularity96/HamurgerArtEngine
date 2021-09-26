
const fs = require("fs")
const path = require('path')
const {createCanvas, loadImage} = require("canvas")
const {layersOrder, format, rarity, env} = require("./config")
const canvas = createCanvas(format.width, format.height)
const ctx = canvas.getContext("2d")



