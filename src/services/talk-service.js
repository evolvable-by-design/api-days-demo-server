const { Talk } = require('../models/Talk');
const Errors = require('../utils/errors');

class TalkService {

  constructor() {
    this.talks = [];
    this.attendees = [];

    this.createTalk({ name: 'First talk', speaker: 'Foo Bar', startTime: Date.now(), category: 'API Design' });
  }
 
  findByName(name) {
    return this.talks.find(talk => talk.name === name);
  }

  findByNameOrFail(name) {
    const talk = this.findByName(name)
    if (talk) {
      return talk;
    } else {
      throw new Errors.NotFound();
    }
  }

  delete(talkName) {
    const talk = this.findByNameOrFail(talkName);
    if (talk) {
      this.talks.splice(this.talks.indexOf(talk), 1);
    } else {
      throw new Errors.BusinessRuleEnforced();
    }
  }

  createTalk({ name, speaker, startTime }) {
    try {
      this.findByNameOrFail(name);
      throw new Errors.BusinessRuleEnforced();
    } catch (error) {
      if (error instanceof Errors.NotFound) {
        const createdTalk = new Talk(name, speaker, new Date(startTime));
        this.talks.push(createdTalk);
        return createdTalk;
      } else {
        throw error
      }
    }
  }

  addAttendee({ name, email }) {
    this.findByNameOrFail(name);
    this.attendees.push({name, email});
  }

}

module.exports = new TalkService();
