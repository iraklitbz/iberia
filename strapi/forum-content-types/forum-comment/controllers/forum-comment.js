'use strict'

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::forum-comment.forum-comment')
