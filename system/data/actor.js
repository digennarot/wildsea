const { StringField, NumberField, ArrayField, SchemaField, ObjectField } = foundry.data.fields;

export class PlayerModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      bloodline: new StringField({ initial: "" }),
      drives: new ArrayField(new ObjectField()),
      edges: new SchemaField({
        grace: new NumberField({ initial: 0, integer: true, min: 0 }),
        iron: new NumberField({ initial: 0, integer: true, min: 0 }),
        instinct: new NumberField({ initial: 0, integer: true, min: 0 }),
        sharps: new NumberField({ initial: 0, integer: true, min: 0 }),
        teeth: new NumberField({ initial: 0, integer: true, min: 0 }),
        tides: new NumberField({ initial: 0, integer: true, min: 0 }),
        veils: new NumberField({ initial: 0, integer: true, min: 0 })
      }),
      languages: new SchemaField({
        lowSour: new NumberField({ initial: 3, integer: true, min: 0 }),
        cthonic: new NumberField({ initial: 0, integer: true, min: 0 }),
        saprekk: new NumberField({ initial: 0, integer: true, min: 0 }),
        gaudimm: new NumberField({ initial: 0, integer: true, min: 0 }),
        knock: new NumberField({ initial: 0, integer: true, min: 0 }),
        brasstongue: new NumberField({ initial: 0, integer: true, min: 0 }),
        rakaSpit: new NumberField({ initial: 0, integer: true, min: 0 }),
        lyreBite: new NumberField({ initial: 0, integer: true, min: 0 }),
        oldHand: new NumberField({ initial: 0, integer: true, min: 0 }),
        signalling: new NumberField({ initial: 0, integer: true, min: 0 }),
        highvin: new NumberField({ initial: 0, integer: true, min: 0 })
      }),
      milestones: new ArrayField(new ObjectField()),
      mires: new ArrayField(new ObjectField()),
      origin: new StringField({ initial: "" }),
      post: new StringField({ initial: "" }),
      skills: new SchemaField({
        brace: new NumberField({ initial: 0, integer: true, min: 0 }),
        break: new NumberField({ initial: 0, integer: true, min: 0 }),
        concoct: new NumberField({ initial: 0, integer: true, min: 0 }),
        cook: new NumberField({ initial: 0, integer: true, min: 0 }),
        delve: new NumberField({ initial: 0, integer: true, min: 0 }),
        flourish: new NumberField({ initial: 0, integer: true, min: 0 }),
        hack: new NumberField({ initial: 0, integer: true, min: 0 }),
        harvest: new NumberField({ initial: 0, integer: true, min: 0 }),
        hunt: new NumberField({ initial: 0, integer: true, min: 0 }),
        outwit: new NumberField({ initial: 0, integer: true, min: 0 }),
        rattle: new NumberField({ initial: 0, integer: true, min: 0 }),
        scavenge: new NumberField({ initial: 0, integer: true, min: 0 }),
        sense: new NumberField({ initial: 0, integer: true, min: 0 }),
        study: new NumberField({ initial: 0, integer: true, min: 0 }),
        sway: new NumberField({ initial: 0, integer: true, min: 0 }),
        tend: new NumberField({ initial: 0, integer: true, min: 0 }),
        vault: new NumberField({ initial: 0, integer: true, min: 0 }),
        wavewalk: new NumberField({ initial: 0, integer: true, min: 0 })
      })
    };
  }
}

export class ShipModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const makeRating = () => new SchemaField({
      value: new NumberField({ initial: 0, integer: true, min: 0 }),
      burn: new NumberField({ initial: 0, integer: true, min: 0 }),
      max: new NumberField({ initial: 1, integer: true, min: 0 })
    });

    return {
      armaments: new ArrayField(new ObjectField()),
      cargoPassengers: new ArrayField(new ObjectField()),
      conditions: new ArrayField(new ObjectField()),
      outriders: new ArrayField(new ObjectField()),
      ratings: new SchemaField({
        armour: makeRating(),
        saws: makeRating(),
        seals: makeRating(),
        speed: makeRating(),
        stealth: makeRating(),
        tilt: makeRating(),
        depth: makeRating()
      }),
      reputations: new ArrayField(new ObjectField()),
      rooms: new ArrayField(new ObjectField()),
      stakes: new SchemaField({
        value: new NumberField({ initial: 0, integer: true, min: 0 }),
        max: new NumberField({ initial: 0, integer: true, min: 0 })
      })
    };
  }
}

export class HazardModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      type: new StringField({ initial: "" }),
      size: new StringField({ initial: "" }),
      traits: new StringField({ initial: "" }),
      description: new StringField({ initial: "" })
    };
  }
}
