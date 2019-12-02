const express = require('express');

const { validateBusinessConstraints } = require('../models/Talk');
const { HypermediaRepresentationBuilder } = require('../hypermedia/hypermedia');
const HypermediaControls = require('../hypermedia/talk');
const utils = require('./utils');
const Errors = require('../utils/errors');
const Responses = require('../utils/responses');

function talkWithHypermediaControls(talk) {
  return HypermediaRepresentationBuilder
    .of(talk)
    .representation(t => t.talkRepresentation())
    .link(HypermediaControls.delete(talk))
    .link(HypermediaControls.attend(talk))
    .build();
}

const talkController = function(talkService) {

  const router = express.Router();

  router.get('/talks', (req, res) => res.status(200).json({ talks: talkService.talks }))

  router.post('/talks', (req, res) =>
    Errors.handleErrorsGlobally(() => {
      const { name, speaker, startTime, category } = req.body;
      if (utils.isAnyEmpty([name, speaker, startTime, category])
        || !validateBusinessConstraints(name, speaker, startTime, category)
      ) {
        Responses.badRequest(res);
      } else {
        const createdTalk = talkService.createTalk(req.body);
        Responses.created(res, talkWithHypermediaControls(createdTalk));
      }
    }, res)
  )

  router.delete('/talks/:name', (req, res) =>
    Errors.handleErrorsGlobally(() => {
      const name = req.params.name;

      try {
        talkService.delete(name)
        Responses.noContent(res)
      } catch (error) {
        if (error instanceof Errors.NotFound) {
          Responses.notFound(res)
        } else {
          res.sendStatus(500)
        }
      }
    }, res))

  router.post('/talks/:name/attend', (req, res) => 
    Errors.handleErrorsGlobally(() => {
      const { email } = req.body;
      if (utils.isAnyEmpty([email])) {
        Responses.badRequest(res);
      } else {
        talkService.addAttendee(name, email);
        Responses.noContent();
      }
    }, res)
  )

  return router

}

module.exports = talkController;
