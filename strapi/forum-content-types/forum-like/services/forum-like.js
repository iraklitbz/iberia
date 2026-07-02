'use strict'

const { createCoreService } = require('@strapi/strapi').factories

module.exports = createCoreService('api::forum-like.forum-like')
