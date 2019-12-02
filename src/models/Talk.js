class Talk {
  constructor(name, speaker, startTime, category) {
    this.name = name;
    this.speaker = speaker;
    this.startTime = startTime;
    this.category = category;
  }

  talkRepresentation() {
    return {
      name: this.name,
      speaker: this.speaker,
      startTime: this.startTime.toISOString(),
      category: this.category
    }
  }

};

const TaskCategoryEnum = [ 'API Design', 'API Maintenance', 'API Management' ]

const validateBusinessConstraints = (name, speaker, startTime, category) => {
  if (!name || (name.length < 10 || name.length > 80)) {
    return false
  } else if (speaker === undefined || speaker === null) {
    return false
  } else if (!startTime || new Date(startTime).toString() === 'Invalid Date') {
    return false
  } else if (!category || !TaskCategoryEnum.includes(category)) {
    return false
  } else {
    return true;
  }
};

module.exports = {
  Talk,
  validateBusinessConstraints
}