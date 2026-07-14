const { StringField, NumberField, ArrayField, SchemaField, BooleanField, ObjectField } = foundry.data.fields;

function hasDetails() {
  return {
    details: new StringField({ initial: "" }),
    collapsed: new BooleanField({ initial: false })
  };
}

function hasTags() {
  return {
    tags: new StringField({ initial: "" })
  };
}

function hasTrack(defaultMax = 8) {
  return {
    track: new SchemaField({
      value: new NumberField({ initial: 0, integer: true, min: 0 }),
      burn: new NumberField({ initial: 0, integer: true, min: 0 }),
      max: new NumberField({ initial: defaultMax, integer: true, min: 0 })
    })
  };
}

function hasRatingMods() {
  return {
    ratingMods: new ArrayField(new ObjectField())
  };
}

export class AspectModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...hasDetails(),
      ...hasTrack(8),
      type: new StringField({ initial: "" })
    };
  }
}

export class DesignModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...hasDetails(),
      ...hasRatingMods(),
      stakes: new NumberField({ initial: 1, integer: true, min: 0 }),
      type: new StringField({ initial: "" })
    };
  }
}

export class FittingModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...hasDetails(),
      ...hasRatingMods(),
      stakes: new NumberField({ initial: 1, integer: true, min: 0 }),
      type: new StringField({ initial: "" }),
      damaged: new BooleanField({ initial: false })
    };
  }
}

export class ResourceModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...hasDetails(),
      ...hasTags()
    };
  }
}

export class TemporaryTrackModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...hasDetails(),
      ...hasTrack(8),
      type: new StringField({ initial: "" })
    };
  }
}

export class UndercrewModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...hasDetails(),
      ...hasTrack(8),
      ...hasRatingMods(),
      stakes: new NumberField({ initial: 1, integer: true, min: 0 }),
      type: new StringField({ initial: "" })
    };
  }
}

export class AttributeModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...hasDetails(),
      type: new StringField({ initial: "" })
    };
  }
}
